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
          <div className="game-date">
            <span>Día 1</span>
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
            </div>
            <div className="shop-inventory">
              <h3>Inventario</h3>
              <div className="inventory-grid">
                {/* Los items se cargarán aquí */}
              </div>
            </div>
          </div>

          <div className="shop-controls">
            <button className="control-button">
              <i className="fas fa-clock"></i>
              <span>Pasar Día</span>
            </button>
            <button className="control-button">
              <i className="fas fa-shopping-cart"></i>
              <span>Comprar</span>
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