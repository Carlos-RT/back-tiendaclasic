const bcrypt = require("bcrypt");
const Usuario = require("../models/usuarioModelo");
const Compra = require("../models/compraModelo");
const jwt = require("jsonwebtoken");

const registrarUsuario = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) return res.status(400).json({ mensaje: "El usuario ya existe" });

    // Cifrar la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({ email, password: passwordHash, role });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el registro" });
  }
};

const iniciarSesion = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).json({ mensaje: "Credenciales incorrectas" });

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) return res.status(401).json({ mensaje: "Credenciales incorrectas" });

    // Generar token con email y rol
    const token = jwt.sign({ email: usuario.email, role: usuario.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ mensaje: "Inicio de sesión exitoso", role: usuario.role, token });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el inicio de sesión" });
  }
};

const registrarCompra = async (req, res) => {
  try {
    // Obtener usuario desde el token
    const token = req.headers.authorization?.split(" ")[1]; // Extrae el token del header
    if (!token) return res.status(401).json({ mensaje: "Acceso denegado. No hay token." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findOne({ email: decoded.email });
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado." });

    const { productos, total } = req.body;

    const nuevaCompra = new Compra({
      usuario: usuario._id, // Guardamos la referencia al usuario
      productos,
      total,
      fechaCompra: new Date(),
      estado: "pendiente",
    });

    await nuevaCompra.save();
    res.status(201).json({ mensaje: "Compra registrada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar la compra (back)" });
  }
};

const obtenerComprasUsuario = async (req, res) => {
  try {
    console.log("Recibiendo solicitud para obtener compras"); // 👀
    
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("❌ No hay token");
      return res.status(401).json({ mensaje: "Acceso denegado. No hay token." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findOne({ email: decoded.email });
    if (!usuario) {
      console.log("❌ Usuario no encontrado");
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    const compras = await Compra.find({ usuario: usuario._id });
    console.log("✅ Compras encontradas:", compras); // 👀

    res.json(compras);
  } catch (error) {
    console.error("❌ Error en obtenerComprasUsuario:", error);
    res.status(500).json({ mensaje: "Error al obtener compras" });
  }
};

const obtenerTodasLasCompras = async (req, res) => {
  try {
    console.log("📌 Recibiendo solicitud para obtener todas las compras");

    if (req.usuario.role !== "admin") {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }

    const compras = await Compra.find().populate("usuario", "email");
    console.log("✅ Compras encontradas:", compras);

    res.json(compras);
  } catch (error) {
    console.error("❌ Error al obtener todas las compras:", error);
    res.status(500).json({ mensaje: "Error al obtener todas las compras" });
  }
};

module.exports = { registrarUsuario, iniciarSesion, registrarCompra, obtenerComprasUsuario, obtenerTodasLasCompras };