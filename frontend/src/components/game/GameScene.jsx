import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/GameScene.css';

const GameScene = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(null);
  
  // Lee el objeto de usuario completo desde localStorage
  const storedUser = localStorage.getItem('user');
  // Parsea el objeto de usuario o usa null si no existe
  const user = storedUser ? JSON.parse(storedUser) : null;
  // Obtiene el nombre del usuario o usa 'Jugador' si el objeto de usuario o el nombre no existen
  const userName = user?.nombre || 'Jugador';

  useEffect(() => {
    loadGameState();
  }, []);

  useEffect(() => {
    if (gameState && gameState._id) {
      localStorage.setItem('gameId', gameState._id);
    }
  }, [gameState]);

  const loadGameState = async () => {
    try {
      const response = await axios.get('/api/game/state');
      setGameState(response.data);
    } catch (error) {
      console.error('Error al cargar el estado del juego:', error);
      navigate('/');
    }
  };

  const handleSaveGame = async () => {
    try {
      if (!gameState || !gameState._id) {
        console.error('No hay estado del juego para guardar');
        return;
      }

      const response = await axios.put(`/api/game/${gameState._id}`, {
        ...gameState,
        lastPlayed: new Date()
      });

      if (response.status === 200) {
        console.log('Juego guardado exitosamente');
        // Opcional: mostrar un mensaje de éxito
      }
    } catch (error) {
      console.error('Error al guardar el estado del juego:', error);
      // Opcional: mostrar un mensaje de error al usuario
    }
  };

  const handleAddMoney = async () => {
    if (gameState) {
      try {
        const updatedState = { ...gameState, money: (gameState.money || 0) + 100 };
        setGameState(updatedState);
        
        // Esperar a que se complete el guardado
        const response = await axios.put(`/api/game/${gameState._id}`, {
          ...updatedState,
          lastPlayed: new Date()
        });

        if (response.status === 200) {
          console.log('Juego guardado exitosamente con el nuevo dinero');
        }
      } catch (error) {
        console.error('Error al guardar el estado del juego:', error);
        // Revertir el estado si hay error
        setGameState(gameState);
      }
    }
  };

  const handleNegotiation = () => {
    if (gameState && gameState._id) {
      navigate(`/game/negotiation/${gameState._id}`);
    } else {
      console.error('No hay ID de juego disponible');
    }
  };

  return (
    <div className="game-scene">
      <div className="game-content">
        <div className="game-header">
          <div className="player-info">
            <span className="player-name">{userName}</span>
            <span className="player-money">${gameState?.money || 1000}</span>
          </div>
        </div>

        <div className="game-main">
          <div className="shop-area">
            <div className="shop-counter">
              <button 
                className="shop-action"
                onClick={handleNegotiation}
              >
                Atender Cliente
              </button>
              <button 
                className="inventory-action"
                onClick={() => navigate('/game/inventory')}
              >
                <i className="fas fa-box-open"></i> Inventario
              </button>
            </div>
          </div>

          <div className="shop-controls">
            <button className="control-button" onClick={() => navigate('/game/upgrades')}>
              <i className="fas fa-tools"></i>
              <span>Mejoras</span>
            </button>
            <button className="control-button" onClick={() => navigate('/game/shop')}>
              <i className="fas fa-store"></i>
              <span>Tienda</span>
            </button>
            <button
              className="control-button"
              onClick={() => navigate('/')}
            >
              <i className="fas fa-home"></i>
              <span>Menú</span>
            </button>
            <button className="control-button" onClick={handleAddMoney}>
              +100$ y guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScene; 