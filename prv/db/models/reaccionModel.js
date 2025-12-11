const mongoose = require("mongoose");

const ReaccionSchema = new mongoose.Schema({
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Confesion", unique: true },
    me_gusta: { type: Number, default: 0 },
    me_divierte: { type: Number, default: 0 },
    me_entristece: { type: Number, default: 0 },
    diablo: { type: Number, default: 0 },
    lloro: { type: Number, default: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model("Reaccion", ReaccionSchema);
