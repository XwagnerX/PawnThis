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
    const gameId = req.params.id;
    if (!gameId) {
      return res.status(400).json({ message: 'Se requiere ID del juego' });
    }

    // Verificar que el juego existe
    const existingGame = await GameState.findById(gameId);
    if (!existingGame) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    // Preparar los datos de actualización
    const updateData = {
      ...req.body,
      lastPlayed: new Date()
    };

    // Actualizar el juego
    const updatedGame = await GameState.findByIdAndUpdate(
      gameId,
      updateData,
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );

    if (!updatedGame) {
      return res.status(404).json({ message: 'No se pudo actualizar el juego' });
    }

    console.log('Juego actualizado:', {
      id: updatedGame._id,
      money: updatedGame.money,
      lastPlayed: updatedGame.lastPlayed
    });

    res.json(updatedGame);
  } catch (error) {
    console.error('Error al actualizar el juego:', error);
    res.status(500).json({ 
      message: 'Error al actualizar el juego',
      error: error.message
    });
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

// Obtener un juego específico por ID
export const getGameById = async (req, res) => {
  try {
    const game = await GameState.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }
    res.json(game);
  } catch (error) {
    console.error('Error al obtener el juego:', error);
    res.status(500).json({ message: 'Error al obtener el juego' });
  }
}; 