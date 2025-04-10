const mongoose = require("mongoose");

const compraSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true }, // Relación con Usuario
  productos: [{ name: String, price: Number }],
  fechaCompra: { type: Date, default: Date.now },
  total: { type: Number, required: true },
  estado: { type: String, default: "pendiente" }, // pendiente, completado
});

module.exports = mongoose.model("Compra", compraSchema);