import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../config/axios';
import '../../styles/Inventory.css';

const TOTAL_SLOTS = 10;

const Inventory = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Obtener gameId de la URL o del localStorage
  const gameId = params.gameId || localStorage.getItem('gameId');
  console.log('gameId usado en Inventory:', gameId);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
        if (!gameId) {
          setError('No se encontró la partida');
          setLoading(false);
          return;
        }
        const response = await axios.get(`/api/items/game/${gameId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(response.data);
      } catch (err) {
        setError('Error al cargar el inventario');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [gameId]);

  // Rellenar los slots vacíos
  const filledSlots = [...items];
  while (filledSlots.length < TOTAL_SLOTS) {
    filledSlots.push(null);
  }

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
        {loading ? (
          <div style={{ color: '#FEFFD4', textAlign: 'center' }}>Cargando inventario...</div>
        ) : error ? (
          <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
        ) : (
          <div className="inventory-grid">
            {filledSlots.map((item, idx) => (
              item && item.imageUrl ? (
                <div key={item._id} className="inventory-card">
                  <div className="inventory-image">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      style={{ 
                        width: '100%',
                        height: '180px',
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
                  <div className="inventory-info">
                    <h3>{item.name}</h3>
                    <p className="inventory-description">Categoría: {item.category}</p>
                    <div className="inventory-level">Estado: {item.condition}</div>
                    <div className="inventory-level">Precio compra: ${item.purchasePrice}</div>
                  </div>
                </div>
              ) : (
                <div key={"empty-"+idx} className="inventory-card empty-slot"></div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory; 