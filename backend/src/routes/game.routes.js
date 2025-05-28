import { 
    getGameState, 
    createGameState, 
    updateGameState, 
    deactivateGameState,
    getGameById,
    updateExistingGames 
} from '../controllers/game.controller.js';

// Ruta para actualizar juegos existentes (solo admin)
router.post('/update-existing', verifyToken, isAdmin, updateExistingGames); 