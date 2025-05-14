import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/GameScene.css';

const GameScene = () => {
  const navigate = useNavigate();

  return (
    <div className="game-scene">
      <div className="game-content">
        <div className="game-header">
          <div className="player-info">
            <span className="player-name">Jugador</span>
            <span className="player-money">$1000</span>
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
              <i className="fas fa-cog"></i>
              <span>Menú</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScene; 