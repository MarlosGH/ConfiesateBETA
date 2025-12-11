const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://machucacarlos833_db_user:o5CVx8uQCDxP9aoF@confiesate-cluster.oupnhpi.mongodb.net/confiesateDB?retryWrites=true&w=majority&appName=confiesate-cluster";

async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("📌 MongoDB conectado correctamente.");
    } catch (error) {
        console.error("❌ Error conectando a MongoDB:", error);
    }
}

module.exports = connectDB;
