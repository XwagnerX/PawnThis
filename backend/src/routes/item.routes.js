import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { getItems, getItemById, createItem, updateItem, deleteItem } from '../controllers/item.controller.js';

const router = express.Router();

// Rutas protegidas
router.get('/', verifyToken, getItems);
router.get('/:id', verifyToken, getItemById);
router.post('/', verifyToken, createItem);
router.put('/:id', verifyToken, updateItem);
router.delete('/:id', verifyToken, deleteItem);

export default router; 