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
    console.log('Destination Folder:', destinationFolder);
    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${uniqueSuffix}${path.extname(file.originalname)}`;
    console.log('File Name:', filename);
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

//TERMINAR CON MULTER
function generateFolderName() {
  const currentDate = new Date();
  return `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}-${currentDate.getMilliseconds()}`;
}
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


app.get('/obtenerTotalConfesiones', (req, res) => {
  // Consultar la cantidad total de confesiones desde la base de datos
  db.get('SELECT count(id) as totalConfesiones FROM confesiones', (err, row) => {
    if (err) {
      console.error('Error al obtener la cantidad total de confesiones:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Enviar la cantidad total de confesiones como respuesta
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
  stmt.run(titulo, descripcion, JSON.stringify(imagenes), carpeta);
  stmt.finalize();

  res.redirect('/');
  folderName = null;
});

app.get('/post', (req,res)=>{
  res.render('post.ejs')
})
// Mandar a la pagina principal

app.get('/', (req, res) => {
  // Consulta para obtener las confesiones desde la base de datos
  db.all('SELECT * FROM confesiones ORDER BY id DESC', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.render('index.ejs', { confesiones: rows, basePath: '/prv/uploads' });
  });
});

app.get('/post/:postId', (req, res) => {
  const postId = req.params.postId;

  // Obtener la información del post desde la base de datos usando postId
  db.get('SELECT * FROM confesiones WHERE id = ?', [postId], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (!row) {
      res.status(404).send('Post not found');
      return;
    }

    res.render('post.ejs', { post: row });
  });
});


const ejsContent = fs.readFileSync(path.join(__dirname, 'views', 'index.ejs'), 'utf-8');
// Renderiza tu archivo EJS a HTML

// Escribe el contenido HTML en un nuevo archivo index.html en la carpeta public


// Inicia el servidor en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});