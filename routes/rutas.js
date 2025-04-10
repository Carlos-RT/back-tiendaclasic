// routes/rutas.js
const express = require("express");
const { registrarUsuario, iniciarSesion, registrarCompra, obtenerComprasUsuario, obtenerTodasLasCompras  } = require("../controllers/controladores");
const autenticarUsuario = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registrarUsuario);
router.post("/login", iniciarSesion);
router.post("/comprar", registrarCompra);
//-----------------------------------------
router.get("/compras", autenticarUsuario, obtenerComprasUsuario);

// Nueva ruta exclusiva para que los administradores obtengan TODAS las compras
router.get("/admin/compras", autenticarUsuario, obtenerTodasLasCompras);

module.exports = router;