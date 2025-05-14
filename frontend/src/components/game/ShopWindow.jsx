import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ShopWindow.css';

const ShopWindow = () => {
  const navigate = useNavigate();

  // Datos de ejemplo para la vitrina
  const shopItems = [
    {
      id: 1,
      name: 'Reloj Antiguo',
      price: 1500,
      description: 'Reloj de bolsillo de la década de 1920',
      image: 'reloj.png'
    },
    {
      id: 2,
      name: 'Jarrón Chino',
      price: 2500,
      description: 'Jarrón de porcelana de la dinastía Ming',
      image: 'jarrón.png'
    },
    {
      id: 3,
      name: 'Cámara Vintage',
      price: 1800,
      description: 'Cámara fotográfica de los años 50',
      image: 'camara.png'
    }
  ];

  return (
    <div className="shop-window-scene">
      <div className="shop-window-content">
        <div className="shop-window-header">
          <h2>Vitrina de la Tienda</h2>
          <button className="back-button" onClick={() => navigate('/game')}>
            <i className="fas fa-arrow-left"></i>
            <span>Volver</span>
          </button>
        </div>

        <div className="shop-window-grid">
          {shopItems.map(item => (
            <div key={item.id} className="shop-item-card">
              <div className="item-image">
                <img src={`/src/assets/images/${item.image}`} alt={item.name} />
              </div>
              <div className="item-info">
                <h3>{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <div className="item-price">${item.price}</div>
                <div className="item-actions">
                  <button className="action-button remove">
                    <i className="fas fa-arrow-left"></i>
                    <span>Devolver al Inventario</span>
                  </button>
                  <button className="action-button adjust">
                    <i className="fas fa-tag"></i>
                    <span>Ajustar Precio</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="shop-window-footer">
          <div className="stats">
            <div className="stat">
              <span className="stat-label">Espacios Ocupados:</span>
              <span className="stat-value">3/6</span>
            </div>
            <div className="stat">
              <span className="stat-label">Valor Total:</span>
              <span className="stat-value">$5,800</span>
            </div>
          </div>
          <button className="add-item-button">
            <i className="fas fa-plus"></i>
            <span>Añadir Item del Inventario</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopWindow; 