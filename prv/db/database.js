const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta de la base de datos
const dbPath = path.join(__dirname, 'confiesate.db');

// Inicializa la base de datos
const db = new sqlite3.Database(dbPath);

// Crea la tabla si no existe
const createTableQuery = `
CREATE TABLE IF NOT EXISTS confesiones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT,
  descripcion TEXT,
  carpeta TEXT,
  imagenes TEXT
);
`;

db.serialize(() => {
    db.run(createTableQuery);
});

module.exports = db;
