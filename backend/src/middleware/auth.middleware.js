import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Intentar obtener el token de diferentes headers
    const token = req.headers['x-access-token'] || 
                 (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(403).json({ message: 'No se proporcionó token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Asegurarnos de que el objeto user tenga la estructura correcta
        req.user = {
            id: decoded.id,
            rol: decoded.rol
        };
        next();
    } catch (error) {
        console.error('Error al verificar token:', error);
        return res.status(401).json({ message: 'Token inválido' });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ message: 'Se requiere rol de administrador' });
    }
    next();
}; 