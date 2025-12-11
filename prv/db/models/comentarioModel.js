const mongoose = require("mongoose");

const ComentarioSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Confesion" },
    text: String
}, {
    timestamps: true
});

module.exports = mongoose.model("Comentario", ComentarioSchema);
