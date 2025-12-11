// MÓDULOS
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
require("dotenv").config();
const { cloudinary, storage } = require("./prv/cloud/cloudinary");
const multerCloud = require("multer");

// Conexión a MongoDB
const connectDB = require("./prv/db/database");
connectDB();

// Modelos MongoDB
const Confesion = require("./prv/db/models/confesionModel");
const Comentario = require("./prv/db/models/comentarioModel");
const Reaccion = require("./prv/db/models/reaccionModel");

// Inicialización
const app = express();
const PORT = process.env.PORT || 3000;

// Crear carpeta uploads si no existe
const destinationFolder = path.join(__dirname, 'uploads');
fs.mkdirSync(destinationFolder, { recursive: true });


let folderName = null;

// Middleware para asignar folderName al request
app.use((req, res, next) => {
  req.folderName = folderName;
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// MULTER CLOUDINARY
const upload = multerCloud({ storage });

// CONFIGURACIÓN
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// FORMULARIO PARA CONFESAR
app.get('/confesarme', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'confesarme.html'));
});

// CANTIDAD TOTAL DE CONFESIONES
app.get('/obtenerTotalConfesiones', async (req, res) => {
  try {
    const total = await Confesion.countDocuments();
    res.json({ totalConfesiones: total });
  } catch (err) {
    console.error("Error al contar confesiones:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUBLICAR UNA CONFESIÓN
app.post('/confesion', upload.array('file'), async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    const imagenes = req.files.map(file => file.path); // URL de Cloudinary
    const carpeta = `confesiones/${folderName}`;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const nuevaConfesion = await Confesion.create({
      titulo,
      descripcion,
      carpeta,
      imagenes,
      ip
    });

    // Crear registro de reacciones para este post
    await Reaccion.create({ post_id: nuevaConfesion._id });

    folderName = null;

    res.redirect('/');
  } catch (err) {
    console.error("Error creando confesión:", err);
    res.status(500).send("Internal Server Error");
  }
});

// AGREGAR COMENTARIO
app.post('/confesion/:postId/comentario', async (req, res) => {
  try {
    const { contenido } = req.body;
    const { postId } = req.params;

    if (!contenido.trim()) return res.redirect(`/post/${postId}`);

    await Comentario.create({
      postId,
      text: contenido
    });

    res.redirect(`/post/${postId}`);
  } catch (err) {
    console.error("Error agregando comentario:", err);
    res.status(500).send("Internal Server Error");
  }
});

// VER UN POST
app.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Confesion.findById(postId);
    if (!post) return res.status(404).send("Post not found");

    const comentarios = await Comentario.find({ postId }).sort({ createdAt: -1 });

    res.render('post.ejs', { post, comentarios });
  } catch (err) {
    console.error("Error mostrando post:", err);
    res.status(500).send("Internal Server Error");
  }
});

// PAGINACIÓN PRINCIPAL
const pageSize = 5;

app.get('/', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const confesiones = await Confesion.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.render('index.ejs', { confesiones, basePath: '/uploads' });
  } catch (err) {
    console.error("Error cargando index:", err);
    res.status(500).send("Internal Server Error");
  }
});

// LOAD-MORE
app.get('/load-more', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const confesiones = await Confesion.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({ confesiones });
  } catch (err) {
    console.error("Error cargando más:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// REACCIONAR
app.post('/reaccionar/:postId/:reactionType', async (req, res) => {
  try {
    const { postId, reactionType } = req.params;

    const valid = ["me_gusta", "me_divierte", "me_entristece", "diablo", "lloro"];
    if (!valid.includes(reactionType)) {
      return res.status(400).json({ error: "Reacción inválida" });
    }

    const updated = await Reaccion.findOneAndUpdate(
      { post_id: postId },
      { $inc: { [reactionType]: 1 } },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Error al reaccionar:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// GENERAR NOMBRE DE CARPETA DE IMÁGENES
function generateFolderName() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
}