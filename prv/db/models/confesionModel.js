const mongoose = require("mongoose");

const ConfesionSchema = new mongoose.Schema({
    titulo: String,
    descripcion: String,
    carpeta: String,
    imagenes: [String], // antes era texto, ahora será array
    ip: String
}, {
    timestamps: true
});

module.exports = mongoose.model("Confesion", ConfesionSchema);
