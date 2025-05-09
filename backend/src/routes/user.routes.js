import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';

const router = express.Router();

// Rutas protegidas
router.get('/', verifyToken, getUsers);
router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

export default router; 