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
        id: 'expert',
        name: 'Experto',
        description: 'Conoces al instante el verdadero valor de los objetos, lo que te permite hacer mejores compras y evitar fraudes.',
        levels: [
          {level: 1,cost: 10000, effect: '' },
        ]
      },
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
      {
        id: 'fast_sale',
        name: 'Ventas Rápidas',
        description: 'Optimiza tus procesos y estrategias para vender objetos más rápido.',
        levels: [
          { level: 1, cost: 1000, effect: 'Reduce el tiempo de venta en un 5%' },
          { level: 2, cost: 2200, effect: 'Reduce el tiempo de venta en un 10%' },
          { level: 3, cost: 4500, effect: 'Reduce el tiempo de venta en un 15%' }
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