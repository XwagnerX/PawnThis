import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar si el token existe en los headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'No autorizado - Token no proporcionado' });
    }

    try {
      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar el usuario y adjuntarlo al request
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'No autorizado - Usuario no encontrado' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'No autorizado - Token inválido' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en la autenticación' });
  }
}; 