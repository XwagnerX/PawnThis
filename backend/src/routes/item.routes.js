import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { getItems, getItemById, createItem, updateItem, deleteItem, purchaseItem, getItemsByGame, putItemForSale, completeSale } from '../controllers/item.controller.js';

const router = express.Router();

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Ruta de items funcionando' });
});

// Rutas protegidas
router.get('/', verifyToken, getItems);
router.get('/:id', verifyToken, getItemById);
router.post('/', verifyToken, createItem);
router.post('/purchase', verifyToken, purchaseItem);
router.put('/:id', verifyToken, updateItem);
router.delete('/:id', verifyToken, deleteItem);
router.get('/game/:gameId', verifyToken, getItemsByGame);
router.put('/sell/:itemId', verifyToken, putItemForSale);
router.post('/complete-sale/:itemId', verifyToken, completeSale);

export default router; 