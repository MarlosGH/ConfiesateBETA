const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'confiesate.db');
const db = new sqlite3.Database(dbPath);

const createTableQuery = `
CREATE TABLE IF NOT EXISTS confesiones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT,
  descripcion TEXT,
  carpeta TEXT,
  imagenes TEXT,
  ip TEXT
);
`;

const createTableComments = `
CREATE TABLE IF NOT EXISTS comentarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  postId INTEGER,
  text TEXT,
  FOREIGN KEY (postId) REFERENCES confesiones(id)
)`;

const createTableReactions = `
CREATE TABLE IF NOT EXISTS reacciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER UNIQUE,
  me_gusta INTEGER DEFAULT 0,
  me_divierte INTEGER DEFAULT 0,
  me_entristece INTEGER DEFAULT 0,
  diablo INTEGER DEFAULT 0,
  lloro INTEGER DEFAULT 0,
  FOREIGN KEY (post_id) REFERENCES confesiones(id)
);`;


db.serialize(() => {
    db.run(createTableQuery);
    db.run(createTableComments);
    db.run(createTableReactions);
});

module.exports = db;