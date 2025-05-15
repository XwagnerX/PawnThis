import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/GameScene.css';

const GameScene = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    loadGameState();
  }, []);

  const loadGameState = async () => {
    try {
      const response = await axios.get('/api/game/state');
      setGameState(response.data);
    } catch (error) {
      console.error('Error al cargar el estado del juego:', error);
      navigate('/');
    }
  };

  const saveGameState = async (newState) => {
    try {
      await axios.put('/api/game/update', newState);
      loadGameState();
    } catch (error) {
      console.error('Error al guardar el estado del juego:', error);
    }
  };

  const handleAddMoney = () => {
    if (gameState) {
      const updatedState = { ...gameState, money: (gameState.money || 0) + 100 };
      setGameState(updatedState);
      saveGameState({ money: updatedState.money });
    }
  };

  return (
    <div className="game-scene">
      <div className="game-content">
        <div className="game-header">
          <div className="player-info">
            <span className="player-name">Jugador</span>
            <span className="player-money">${gameState?.money || 1000}</span>
          </div>
        </div>

        <div className="game-main">
          <div className="shop-area">
            <div className="shop-counter">
              <button 
                className="shop-action"
                onClick={() => navigate('/game/negotiation')}
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