import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import '../../styles/SalesHistory.css';

const SalesHistory = ({ isOpen, onClose }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalBonus, setTotalBonus] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchSalesHistory();
    }
  }, [isOpen]);

  const fetchSalesHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const gameId = localStorage.getItem('gameId');
      
      const response = await axios.get(`/api/items/game/${gameId}/sales-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSales(response.data.sales);
      setTotalBonus(response.data.totalBonus || 0);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar el historial:', err);
      setError('Error al cargar el historial de ventas');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sales-history-modal">
      <div className="sales-history-content">
        <div className="sales-history-header">
          <h2>Historial de Ventas</h2>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Cargando historial...</div>
        ) : (
          <>
            {totalBonus > 0 && (
              <div className="total-bonus">
                <h3>Total ganado por fama: ${totalBonus}</h3>
              </div>
            )}
            
            <div className="sales-list">
              {sales.length === 0 ? (
                <p className="no-sales">No hay ventas registradas</p>
              ) : (
                sales.map((sale, index) => (
                  <div key={index} className="sale-item">
                    <div className="sale-info">
                      <span className="item-name">{sale.itemName}</span>
                      <span className="sale-date">
                        {new Date(sale.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="sale-details">
                      <div className="price-info">
                        <span className="original-price">
                          Precio original: ${sale.originalPrice}
                        </span>
                        {sale.bonusApplied !== '0%' && (
                          <>
                            <span className="bonus">
                              Bonus de fama: {sale.bonusApplied}
                            </span>
                            <span className="bonus-amount">
                              +${sale.finalPrice - sale.originalPrice}
                            </span>
                          </>
                        )}
                        <span className="final-price">
                          Precio final: ${sale.finalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SalesHistory; 