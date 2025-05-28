import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import '../../styles/Upgrades.css';

const Upgrades = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const token = localStorage.getItem('token');
        const gameId = localStorage.getItem('gameId');
        
        const response = await axios.get(`/api/game/${gameId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setGameState(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el estado del juego');
        setLoading(false);
      }
    };

    fetchGameState();
  }, []);

  const handleUpgrade = async (upgradeId, level, cost) => {
    if (!gameState) return;

    if (gameState.money < cost) {
      setError('No tienes suficiente dinero para esta mejora');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const gameId = localStorage.getItem('gameId');

      const currentUpgrades = Array.isArray(gameState.upgrades) ? [...gameState.upgrades] : [];
      const upgradeIndex = currentUpgrades.findIndex(u => u.type === upgradeId);
      
      if (upgradeIndex >= 0) {
        currentUpgrades[upgradeIndex] = { type: upgradeId, level };
      } else {
        currentUpgrades.push({ type: upgradeId, level });
      }

      const updatedGame = {
        money: gameState.money - cost,
        upgrades: currentUpgrades
      };

      if (upgradeId === 'inventory') {
        const baseInventorySpace = 3;
        let bonusSpace = 0;
        
        switch(level) {
          case 1:
            bonusSpace = 5;
            break;
          case 2:
            bonusSpace = 10;
            break;
          case 3:
            bonusSpace = 15;
            break;
          default:
            bonusSpace = 0;
        }
        
        updatedGame.inventorySpace = baseInventorySpace + bonusSpace;
        updatedGame.inventoryUpgrades = level;
      } else if (upgradeId === 'fast_sale') {
        let timeReduction = 0;
        switch(level) {
          case 1:
            timeReduction = 5;
            break;
          case 2:
            timeReduction = 10;
            break;
          case 3:
            timeReduction = 15;
            break;
          default:
            timeReduction = 0;
        }
        
        updatedGame.saleTimeReduction = timeReduction;
        updatedGame.fastSaleUpgrades = level;
      }

      console.log('Enviando actualización:', updatedGame);

      const response = await axios.put(`/api/game/${gameId}`, updatedGame, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setGameState(response.data);
      setError('');
    } catch (err) {
      console.error('Error al actualizar:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error al comprar la mejora');
    }
  };

  const isUpgradeAvailable = (upgradeId, level) => {
    if (!gameState) return false;
    
    const currentUpgrade = Array.isArray(gameState.upgrades) 
      ? gameState.upgrades.find(upgrade => upgrade.type === upgradeId)
      : null;
    const currentLevel = currentUpgrade ? currentUpgrade.level : 0;
    
    const upgradeCost = upgrades.shop.find(u => u.id === upgradeId)?.levels[level-1]?.cost || 0;
    
    return level === currentLevel + 1 && gameState.money >= upgradeCost;
  };

  const upgrades = {
    shop: [
      {
        id: 'inventory',
        name: 'Espacio de Inventario',
        description: 'Aumenta el espacio disponible para almacenar objetos',
        levels: [
          { level: 1, cost: 500, effect: '+5 espacios' },
          { level: 2, cost: 1000, effect: '+10 espacios' },
          { level: 3, cost: 2000, effect: '+15 espacios' }
        ]
      },
      {
        id: 'fast_sale',
        name: 'Ventas Rápidas',
        description: 'Optimiza tus procesos y estrategias para vender objetos más rápido',
        levels: [
          { level: 1, cost: 1000, effect: '-5% tiempo de venta' },
          { level: 2, cost: 2200, effect: '-10% tiempo de venta' },
          { level: 3, cost: 4500, effect: '-15% tiempo de venta' }
        ]
      }
    ],
    personal: [
      {
        id: 'fame',
        name: 'Fama',
        description: 'Aumenta tu reputación, lo que te permite obtener más dinero en cada venta gracias a tu prestigio.',
        levels: [
          { level: 1, cost: 1200, effect: '+5% de ganancia en cada venta' },
          { level: 2, cost: 2500, effect: '+10% de ganancia en cada venta' },
          { level: 3, cost: 5000, effect: '+15% de ganancia en cada venta' }
        ]
      },
    ]
  };

  if (loading) {
    return <div className="upgrades-scene">
      <div className="upgrades-content">
        <p>Cargando mejoras...</p>
      </div>
    </div>;
  }

  return (
    <div className="upgrades-scene">
      <div className="upgrades-content">
        <div className="upgrades-header">
          <h2>Mejoras</h2>
          {gameState && (
            <div className="money-display">
              Dinero disponible: ${gameState.money}
            </div>
          )}
          <button className="back-button" onClick={() => navigate('/game')}>
            <i className="fas fa-arrow-left"></i>
            <span>Volver</span>
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="upgrades-sections">
          <section className="upgrade-section">
            <h3>Mejoras de Tienda</h3>
            <div className="upgrades-grid">
              {upgrades.shop.map(upgrade => (
                <div key={upgrade.id} className="upgrade-card">
                  <h4>{upgrade.name}</h4>
                  <p>{upgrade.description}</p>
                  <div className="upgrade-levels">
                    {upgrade.levels.map(level => {
                      const isAvailable = isUpgradeAvailable(upgrade.id, level.level);
                      const currentLevel = gameState?.upgrades?.[upgrade.id] || 0;
                      const isOwned = currentLevel >= level.level;

                      return (
                        <button 
                          key={level.level} 
                          className={`upgrade-button ${isOwned ? 'owned' : ''} ${isAvailable ? 'available' : ''}`}
                          onClick={() => isAvailable && handleUpgrade(upgrade.id, level.level, level.cost)}
                          disabled={!isAvailable || isOwned}
                        >
                          <span className="level">Nivel {level.level}</span>
                          <span className="cost">${level.cost}</span>
                          <span className="effect">{level.effect}</span>
                          {isOwned && <span className="owned-label">Comprado</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="upgrade-section">
            <h3>Mejoras Personales</h3>
            <div className="upgrades-grid">
              {upgrades.personal.map(upgrade => (
                <div key={upgrade.id} className="upgrade-card">
                  <h4>{upgrade.name}</h4>
                  <p>{upgrade.description}</p>
                  <div className="upgrade-levels">
                    {upgrade.levels.map(level => {
                      const isAvailable = isUpgradeAvailable(upgrade.id, level.level);
                      const currentLevel = gameState?.upgrades?.[upgrade.id] || 0;
                      const isOwned = currentLevel >= level.level;

                      return (
                        <button 
                          key={level.level} 
                          className={`upgrade-button ${isOwned ? 'owned' : ''} ${isAvailable ? 'available' : ''}`}
                          onClick={() => isAvailable && handleUpgrade(upgrade.id, level.level, level.cost)}
                          disabled={!isAvailable || isOwned}
                        >
                          <span className="level">Nivel {level.level}</span>
                          <span className="cost">${level.cost}</span>
                          <span className="effect">{level.effect}</span>
                          {isOwned && <span className="owned-label">Comprado</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Upgrades; 