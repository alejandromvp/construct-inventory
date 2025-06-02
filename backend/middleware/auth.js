// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rutas
exports.protect = async (req, res, next) => {
  let token;
  
  // Verificar si existe el token en los headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener token del header
      token = req.headers.authorization.split(' ')[1];
      
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Obtener el usuario del token
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'No autorizado, token inválido' });
    }
  }
  
  if (!token) {
    res.status(401).json({ message: 'No autorizado, no se proporcionó token' });
  }
};

// Middleware para verificar rol de administrador
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'No autorizado, se requiere rol de administrador' });
  }
};

// Middleware para verificar rol de gerente o administrador
exports.manager = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
    next();
  } else {
    res.status(403).json({ message: 'No autorizado, se requiere rol de gerente o administrador' });
  }
};