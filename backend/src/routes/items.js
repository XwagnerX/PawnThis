import { Router } from 'express';
import { getItems, purchaseItem, putItemForSale } from '../controllers/item.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Ruta de items funcionando' });
});

// Rutas protegidas
router.get('/game/:gameId', verifyToken, getItems);
router.post('/purchase', verifyToken, purchaseItem);
router.put('/sell/:itemId', verifyToken, putItemForSale);

export default router; 