import GameState from '../models/gameStateModel.js';

export const getGameState = async (req, res) => {
  try {
    const gameState = await GameState.findOne({ 
      userId: req.user._id,
      isActive: true 
    });
    
    if (!gameState) {
      return res.status(404).json({ message: 'No hay partida activa' });
    }
    
    res.json(gameState);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el estado del juego' });
  }
};

export const createGameState = async (req, res) => {
  try {
    console.log('Intentando crear partida para usuario:', req.user?._id);
    const existingGame = await GameState.findOne({ 
      userId: req.user._id,
      isActive: true 
    });

    if (existingGame) {
      console.log('Ya existe una partida activa para este usuario');
      return res.status(400).json({ 
        message: 'Ya tienes una partida activa',
        hasActiveGame: true
      });
    }

    const newGameState = new GameState({
      userId: req.user._id,
      money: 1000,
      inventory: [],
      upgrades: []
    });

    await newGameState.save();
    console.log('Partida creada correctamente:', newGameState);
    res.status(201).json(newGameState);
  } catch (error) {
    console.error('Error al crear nueva partida:', error);
    res.status(500).json({ message: 'Error al crear nueva partida' });
  }
};

export const updateGameState = async (req, res) => {
  try {
    const gameState = await GameState.findOneAndUpdate(
      { userId: req.user._id, isActive: true },
      { ...req.body, lastPlayed: Date.now() },
      { new: true }
    );
    if (!gameState) {
      return res.status(404).json({ message: 'No se encontró la partida' });
    }
    res.json(gameState);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estado del juego' });
  }
};

export const deactivateGameState = async (req, res) => {
  try {
    const gameState = await GameState.findOneAndUpdate(
      { userId: req.user._id, isActive: true },
      { isActive: false },
      { new: true }
    );
    if (!gameState) {
      return res.status(404).json({ message: 'No se encontró partida activa para desactivar' });
    }
    res.json({ message: 'Partida desactivada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al desactivar la partida' });
  }
}; 