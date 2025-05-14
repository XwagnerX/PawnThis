import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Inventory.css';

const inventoryItems = [
  {
    id: 1,
    name: 'Reloj Antiguo',
    description: 'Reloj de bolsillo de la década de 1920',
    image: 'reloj.png',
    level: 1
  },
  {
    id: 2,
    name: 'Jarrón Chino',
    description: 'Jarrón de porcelana de la dinastía Ming',
    image: 'jarrón.png',
    level: 2
  },
  {
    id: 3,
    name: 'Cámara Vintage',
    description: 'Cámara fotográfica de los años 50',
    image: 'camara.png',
    level: 1
  }
];

const TOTAL_SLOTS = 10;
const filledSlots = [...inventoryItems];
while (filledSlots.length < TOTAL_SLOTS) {
  filledSlots.push(null);
}

const Inventory = () => {
  const navigate = useNavigate();

  return (
    <div className="inventory-scene">
      <div className="inventory-content">
        <div className="inventory-header">
          <h2>Inventario</h2>
          <button className="back-button" onClick={() => navigate('/game')}>
            <i className="fas fa-arrow-left"></i>
            <span>Volver</span>
          </button>
        </div>
        <div className="inventory-grid">
          {filledSlots.map((item, idx) => (
            item ? (
              <div key={item.id} className="inventory-card">
                <div className="inventory-image">
                  <img src={`/src/assets/images/${item.image}`} alt={item.name} />
                </div>
                <div className="inventory-info">
                  <h3>{item.name}</h3>
                  <p className="inventory-description">{item.description}</p>
                  <div className="inventory-level">Nivel: {item.level}</div>
                  <div className="inventory-actions">
                    <button className="inventory-btn improve">
                      <i className="fas fa-arrow-up"></i>
                    </button>
                    <button className="inventory-btn details">
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div key={"empty-"+idx} className="inventory-card empty-slot"></div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inventory; 