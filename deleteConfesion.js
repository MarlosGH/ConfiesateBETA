// deleteConfesion.js
const mongoose = require("mongoose");
const Confesion = require("./models/confesionModel");
const Comentario = require("./models/comentarioModel");
const Reaccion = require("./models/reaccionModel");

const MONGODB_URI = "mongodb+srv://machucacarlos833_db_user:o5CVx8uQCDxP9aoF@confiesate-cluster.oupnhpi.mongodb.net/confiesateDB?retryWrites=true&w=majority&appName=confiesate-cluster";

const id = process.argv[2];

if (!id) {
  console.log("❌ Debes proporcionar un ID de confesión para eliminar.");
  process.exit(1);
}

async function eliminarConfesion() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("📌 Conectado a MongoDB.");

    const deletedConfesion = await Confesion.findByIdAndDelete(id);

    if (!deletedConfesion) {
      console.log("⚠️ No se encontró ninguna confesión con ese ID.");
      return process.exit(0);
    }

    // Eliminar comentarios asociados
    await Comentario.deleteMany({ postId: id });

    // Eliminar reacciones asociadas
    await Reaccion.deleteOne({ postId: id });

    console.log("✅ Confesión y datos relacionados eliminados correctamente.");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error eliminando:", error);
    process.exit(1);
  }
}

eliminarConfesion();
