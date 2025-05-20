import express from 'express';
import { getGameState, createGameState, deactivateGameState, updateGameState, getGameById } from '../controllers/gameStateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/state', protect, getGameState);
router.get('/:id', protect, getGameById);
router.post('/new', protect, createGameState);
router.put('/deactivate', protect, deactivateGameState);
router.put('/update', protect, updateGameState);
router.put('/:id', protect, updateGameState);

export default router; 