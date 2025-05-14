import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Upgrades.css';

const Upgrades = () => {
  const navigate = useNavigate();

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
        id: 'shopSpace',
        name: 'Espacio de Tienda',
        description: 'Amplía el área de exposición de productos',
        levels: [
          { level: 1, cost: 800, effect: '+2 vitrinas' },
          { level: 2, cost: 1500, effect: '+4 vitrinas' },
          { level: 3, cost: 3000, effect: '+6 vitrinas' }
        ]
      }
    ],
    personal: [
      {
        id: 'charisma',
        name: 'Carisma',
        description: 'Mejora tu capacidad de negociación y relaciones con clientes',
        levels: [
          { level: 1, cost: 1000, effect: '+10% en precios de venta' },
          { level: 2, cost: 2000, effect: '+20% en precios de venta' },
          { level: 3, cost: 4000, effect: '+30% en precios de venta' }
        ]
      },
      {
        id: 'lieDetection',
        name: 'Detección de Mentiras',
        description: 'Aprende a identificar cuando los clientes mienten sobre sus productos',
        levels: [
          { level: 1, cost: 1500, effect: 'Detecta mentiras básicas' },
          { level: 2, cost: 3000, effect: 'Detecta mentiras avanzadas' },
          { level: 3, cost: 6000, effect: 'Detecta todas las mentiras' }
        ]
      },
      {
        id: 'patience',
        name: 'Control Emocional',
        description: 'Mejora tu paciencia y capacidad de manejar situaciones difíciles',
        levels: [
          { level: 1, cost: 1200, effect: '+15% en negociaciones difíciles' },
          { level: 2, cost: 2500, effect: '+30% en negociaciones difíciles' },
          { level: 3, cost: 5000, effect: '+50% en negociaciones difíciles' }
        ]
      }
    ]
  };

  return (
    <div className="upgrades-scene">
      <div className="upgrades-content">
        <div className="upgrades-header">
          <h2>Mejoras</h2>
          <button className="back-button" onClick={() => navigate('/game')}>
            <i className="fas fa-arrow-left"></i>
            <span>Volver</span>
          </button>
        </div>

        <div className="upgrades-sections">
          <section className="upgrade-section">
            <h3>Mejoras de Tienda</h3>
            <div className="upgrades-grid">
              {upgrades.shop.map(upgrade => (
                <div key={upgrade.id} className="upgrade-card">
                  <h4>{upgrade.name}</h4>
                  <p>{upgrade.description}</p>
                  <div className="upgrade-levels">
                    {upgrade.levels.map(level => (
                      <button key={level.level} className="upgrade-button">
                        <span className="level">Nivel {level.level}</span>
                        <span className="cost">${level.cost}</span>
                        <span className="effect">{level.effect}</span>
                      </button>
                    ))}
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
                    {upgrade.levels.map(level => (
                      <button key={level.level} className="upgrade-button">
                        <span className="level">Nivel {level.level}</span>
                        <span className="cost">${level.cost}</span>
                        <span className="effect">{level.effect}</span>
                      </button>
                    ))}
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