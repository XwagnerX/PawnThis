import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import '../../styles/ShopWindow.css';

const ShopWindow = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timers, setTimers] = useState({});
  const [saleInputs, setSaleInputs] = useState({});
  const [money, setMoney] = useState(null);
  const [errorInputs, setErrorInputs] = useState({});

  // Obtener gameId del localStorage
  const gameId = localStorage.getItem('gameId');

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, []);

  // Refresca los temporizadores cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(timers => ({ ...timers })); // Forzar re-render
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/items/game/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar los items de la tienda');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (itemId, value) => {
    setSaleInputs(inputs => ({ ...inputs, [itemId]: value }));
  };

  const handlePutForSale = async (item) => {
    const salePrice = Number(saleInputs[item._id]);
    const maxPrice = Math.round(item.requestedPrice * 1.3);
    if (isNaN(salePrice) || salePrice < item.purchasePrice) {
      setErrorInputs(errors => ({ ...errors, [item._id]: 'El precio debe ser igual o mayor al de compra.' }));
      return;
    }
    if (salePrice > maxPrice) {
      setErrorInputs(errors => ({ ...errors, [item._id]: '¡Nadie te lo comprará por ese precio!' }));
      return;
    }
    setErrorInputs(errors => ({ ...errors, [item._id]: null }));
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/items/sell/${item._id}`, { salePrice }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
    } catch (err) {
      setErrorInputs(errors => ({ ...errors, [item._id]: err.response?.data?.message || 'Error al poner a la venta' }));
    }
  };

  const handleCompleteSale = async (item) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/items/complete-sale/${item._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMoney(res.data.money);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al completar la venta');
    }
  };

  const getTimeLeft = (item) => {
    if (!item.saleStartTime) return 60;
    const start = new Date(item.saleStartTime).getTime();
    const now = Date.now();
    const diff = Math.max(0, 60 - Math.floor((now - start) / 1000));
    return diff;
  };

  useEffect(() => {
    // Venta automática tras 1 minuto
    items.forEach(item => {
      if (item.forSale && item.saleStartTime) {
        const timeLeft = getTimeLeft(item);
        if (timeLeft === 0) {
          handleCompleteSale(item);
        }
      }
    });
    // eslint-disable-next-line
  }, [items, timers]);

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
        {loading ? (
          <div style={{ color: '#FEFFD4', textAlign: 'center' }}>Cargando items...</div>
        ) : error ? (
          <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
        ) : (
          <div className="shop-window-grid">
            {items.filter(item => item.imageUrl).map(item => (
              <div key={item._id} className="shop-item-card">
                <div className="item-image">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    style={{ 
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.style.display = 'none';
                      e.target.parentElement.parentElement.style.display = 'none';
                    }}
                  />
                </div>
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="item-description">Categoría: {item.category}</p>
                  <div className="item-price">Precio compra: ${item.purchasePrice}</div>
                  {item.forSale ? (
                    <>
                      <div className="item-price" style={{ color: '#ffe082' }}>En venta por: ${item.salePrice}</div>
                      <div className="sale-timer">
                        {getTimeLeft(item) > 0 ? `Vendiendo en: ${getTimeLeft(item)}s` : '¡Vendido!'}
                      </div>
                    </>
                  ) : (
                    <div style={{ marginTop: '1rem', width: '100%' }}>
                      <input
                        type="number"
                        placeholder={`Precio de venta`}
                        value={saleInputs[item._id] || ''}
                        onChange={e => handleInputChange(item._id, e.target.value)}
                        style={{ width: '80%', padding: '0.4rem', borderRadius: '5px', border: '1px solid #ffe082', marginBottom: '0.5rem' }}
                      />
                      {errorInputs[item._id] && (
                        <div className="shop-error-message">{errorInputs[item._id]}</div>
                      )}
                      <button className="action-button adjust" onClick={() => handlePutForSale(item)}>
                        <i className="fas fa-tag"></i>
                        <span>Poner a la venta</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="shop-window-footer">
          {money !== null && (
            <div style={{ color: '#ffe082', fontWeight: 'bold', fontSize: '1.2rem' }}>
              ¡Venta completada! Dinero actual: ${money}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopWindow; 