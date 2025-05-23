import { Router } from 'express';
import { getGameUpgrades, purchaseUpgrade } from '../controllers/upgrade.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

// Rutas protegidas
router.get('/game/:gameId', verifyToken, getGameUpgrades);
router.post('/game/:gameId/purchase', verifyToken, purchaseUpgrade);

export default router; 