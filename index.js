require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const rutas = require("./routes/rutas");


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/", rutas);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.log("Error en conexión a MongoDB", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
console.log("JWT_SECRET:", process.env.JWT_SECRET);