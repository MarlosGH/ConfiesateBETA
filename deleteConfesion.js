// deleteConfesion.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./prv/db/confiesate.db'); // ajusta el nombre de tu base de datos

const id = process.argv[2]; // El ID se pasa como argumento en la consola

if (!id) {
  console.log("❌ Debes proporcionar el ID de la confesión que quieres eliminar.");
  process.exit(1);
}

db.run('DELETE FROM confesiones WHERE id = ?', [id], function(err) {
  if (err) {
    console.error('⚠️ Error al eliminar la confesión:', err.message);
  } else if (this.changes === 0) {
    console.log('⚠️ No se encontró ninguna confesión con ese ID.');
  } else {
    console.log(`✅ Confesión con ID ${id} eliminada correctamente.`);
  }
  db.close();
});