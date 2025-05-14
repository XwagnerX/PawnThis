import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).json({ message: 'No se proporcionó token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.userRol = decoded.rol;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.userRol !== 'admin') {
        return res.status(403).json({ message: 'Se requiere rol de administrador' });
    }
    next();
}; 