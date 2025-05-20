import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { getNewClient, evaluateOffer } from '../controllers/client.controller.js';

const router = express.Router();

// Obtener un nuevo cliente con item
router.get('/new', verifyToken, getNewClient);

// Evaluar una oferta de compra
router.post('/evaluate-offer', verifyToken, evaluateOffer);

export default router; 