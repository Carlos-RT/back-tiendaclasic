const jwt = require("jsonwebtoken");

const autenticarUsuario = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ mensaje: "Acceso denegado. No hay token." });

  try {
    const verificado = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.usuario = verificado; // Guardamos el usuario en req.usuario
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "Token inválido." });
  }
};

module.exports = autenticarUsuario;