// Exportar modulos
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('./prv/db/database'); // Importar base de datos
const bodyParser = require('body-parser');

// Inicializaciones
const app = express();
const PORT = process.env.PORT || 3000;
const destinationFolder = path.join(__dirname, 'uploads');
fs.mkdirSync(destinationFolder, { recursive: true });

// Multer
let folderName = null;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!folderName) {
      folderName = generateFolderName();
    }
    const destinationFolder = path.join(__dirname, 'uploads', folderName);
    fs.mkdirSync(destinationFolder, { recursive: true });
    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Middleware para analizar el cuerpo de las solicitudes
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/prv', express.static(path.join(__dirname, 'prv')));
app.use(bodyParser.json());

// Ruta para mostrar el formulario de publicación
app.get('/confesarme', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'confesarme.html'));
});

// Obtener la cantidad total de confesiones
app.get('/obtenerTotalConfesiones', (req, res) => {
  db.get('SELECT count(id) as totalConfesiones FROM confesiones', (err, row) => {
    if (err) {
      console.error('Error al obtener la cantidad total de confesiones:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ totalConfesiones: row.totalConfesiones });
  });
});

// Ruta para manejar la publicación del formulario
app.post('/confesion', upload.array('file'), (req, res) => {
  const descripcion = req.body.descripcion;
  const titulo = req.body.titulo;
  const imagenes = req.files ? req.files.map(file => file.filename) : [];
  const carpeta = req.files && req.files.length > 0 ? path.basename(path.dirname(req.files[0].path)) : null;

  const stmt = db.prepare('INSERT INTO confesiones (titulo, descripcion, imagenes, carpeta) VALUES (?, ?, ?, ?)');
  stmt.run(titulo, descripcion, JSON.stringify(imagenes), carpeta, (err) => {
    if (err) {
      console.error('Error al insertar confesión en la base de datos:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.redirect('/');
  });
  stmt.finalize();
  folderName = null;
});

// Ruta para manejar la publicación del formulario y agregar comentarios
app.post('/confesion/:postId/comentario', (req, res) => {
  const postId = req.params.postId;
  const contenido = req.body.contenido;

  const stmt = db.prepare('INSERT INTO comentarios (postId, text) VALUES (?, ?)');
  stmt.run(postId, contenido, (err) => {
    if (err) {
      console.error('Error al insertar comentario en la base de datos:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.redirect(`/post/${postId}`);
  });
  stmt.finalize();
});

// Ruta para mostrar la página de un post y sus comentarios
app.get('/post/:postId', (req, res) => {
  const postId = req.params.postId;

  const postStmt = db.prepare('SELECT * FROM confesiones WHERE id = ?');
  postStmt.get(postId, (err, post) => {
    if (err) {
      console.error('Error al obtener el post desde SQLite:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (!post) {
      return res.status(404).send('Post not found');
    }

    const comentariosStmt = db.prepare('SELECT * FROM comentarios WHERE postId = ?');
    comentariosStmt.all(postId, (err, comentarios) => {
      if (err) {
        console.error('Error al obtener comentarios desde SQLite:', err);
        return res.status(500).send('Internal Server Error');
      }

      res.render('post.ejs', { post: post, comentarios: comentarios });
    });
  });
});
const pageSize = -1;

// Ruta para mostrar la página principal con las confesiones
app.get('/', (req, res) => {
  // Obtener el número de página desde la consulta, si no se proporciona, usar la página 1
  const page = req.query.page || 1;

  // Calcular el índice de inicio basado en el tamaño de página y la página actual
  const startIndex = (page - 1) * pageSize;

  // Consulta para obtener las confesiones desde la base de datos, limitadas por el tamaño de página y el índice de inicio
  db.all('SELECT * FROM confesiones ORDER BY id DESC LIMIT ? OFFSET ?', [pageSize, startIndex], (err, rows) => {
    if (err) {
      console.error('Error al obtener confesiones desde SQLite:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.render('index.ejs', { confesiones: rows, basePath: '/prv/uploads' });
  });
});

app.get('/load-more', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = 5; // Número de posts por página
    const offset = (page - 1) * pageSize;

    // Consulta para obtener más confesiones desde SQLite
    const query = `SELECT * FROM confesiones ORDER BY id DESC LIMIT ${pageSize} OFFSET ${offset}`;
    const confesiones = await db.all(query);

    // Enviar las confesiones como respuesta
    res.json(confesiones);
  } catch (err) {
    console.error('Error al cargar más confesiones desde SQLite:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Inicia el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

function generateFolderName() {
  const currentDate = new Date();
  return `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}-${currentDate.getMilliseconds()}`;
}
