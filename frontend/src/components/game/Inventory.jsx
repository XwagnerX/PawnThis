import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../config/axios';
import '../../styles/Inventory.css';
import ItemCondition from '../common/ItemCondition';
import { FaTools } from 'react-icons/fa';

const Inventory = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gameState, setGameState] = useState(null);

  const gameId = params.gameId || localStorage.getItem('gameId');
  console.log('gameId usado en Inventory:', gameId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!gameId) {
          setError('No se encontró la partida');
          setLoading(false);
          return;
        }
        
        const itemsResponse = await axios.get(`/api/items/game/${gameId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(itemsResponse.data.filter(item => !item.forSale));

        const gameResponse = await axios.get(`/api/game/${gameId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGameState(gameResponse.data);
      } catch (err) {
        setError('Error al cargar el inventario');
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [gameId]);

  const totalInventorySpace = gameState?.inventorySpace || 3;
  const currentItems = items?.length || 0;

  const filledSlots = [...(items || [])];
  while (filledSlots.length < totalInventorySpace) {
    filledSlots.push(null);
  }

  const calculateRepairCost = (item) => {
    const marketPrice = item.requestedPrice;
    switch (item.condition.toLowerCase()) {
      case 'usado':
        return Math.round(marketPrice * 0.10);
      case 'regular':
        return Math.round(marketPrice * 0.15);
      case 'bueno':
        return Math.round(marketPrice * 0.25);
      default:
        return 0;
    }
  };

  const calculateNewValue = (item) => {
    const marketPrice = item.requestedPrice;
    switch (item.condition.toLowerCase()) {
      case 'usado':
        return Math.round(marketPrice * 1.12);
      case 'regular':
        return Math.round(marketPrice * 1.17);
      case 'bueno':
        return Math.round(marketPrice * 1.30);
      default:
        return marketPrice;
    }
  };

  const getNextCondition = (currentCondition) => {
    switch (currentCondition.toLowerCase()) {
      case 'usado':
        return 'regular';
      case 'regular':
        return 'bueno';
      case 'bueno':
        return 'excelente';
      default:
        return currentCondition;
    }
  };

  const handleRepair = async (item) => {
    if (!gameState) return;

    const repairCost = calculateRepairCost(item);
    if (gameState.money < repairCost) {
      setError('No tienes suficiente dinero para reparar este objeto');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const newValue = calculateNewValue(item);
      const nextCondition = getNextCondition(item.condition);

      await axios.put(`/api/items/${item._id}`, {
        condition: nextCondition,
        requestedPrice: newValue
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedGameState = {
        ...gameState,
        money: gameState.money - repairCost
      };
      await axios.put(`/api/game/${gameId}`, updatedGameState, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setGameState(updatedGameState);
      const updatedItems = items.map(i => 
        i._id === item._id 
          ? { ...i, condition: nextCondition, requestedPrice: newValue }
          : i
      );
      setItems(updatedItems);
      setError('');
    } catch (err) {
      setError('Error al reparar el objeto');
    }
  };

  return (
    <div className="inventory-scene">
      <div className="inventory-content">
        <div className="inventory-header">
          <h2>Inventario</h2>
          <div className="inventory-stats">
            <div className="inventory-counter">
              Espacio: {currentItems}/{totalInventorySpace}
            </div>
          </div>
          <button className="back-button" onClick={() => navigate('/game')}>
            <i className="fas fa-arrow-left"></i>
            <span>Volver</span>
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div style={{ color: '#FEFFD4', textAlign: 'center' }}>Cargando inventario...</div>
        ) : (
          <div className="inventory-grid">
            {filledSlots.map((item, idx) => (
              item ? (
                <div key={item._id} className="inventory-card">
                  <div className="inventory-image">
                    <img 
                      src={item.imageUrl || 'https://placehold.co/400x400/412008/FEFFD4?text=No+Image'} 
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
                        e.target.src = `https://placehold.co/400x400/412008/FEFFD4?text=${encodeURIComponent(item.name)}`;
                      }}
                    />
                  </div>
                  <div className="inventory-info">
                    <h3>{item.name}</h3>
                    <div className="condition-display">
                      <span>Estado: </span>
                      <ItemCondition condition={item.condition} />
                    </div>
                    <p className="inventory-description">Categoría: {item.category}</p>
                    <div className="inventory-level">Precio mercado: ${item.requestedPrice}</div>
                    <div className="inventory-level">Precio compra: ${item.purchasePrice}</div>
                    {item.condition.toLowerCase() !== 'excelente' && !item.isForSale && (
                      <div className="repair-section">
                        <div className="repair-cost">
                          Coste reparación: ${calculateRepairCost(item)}
                        </div>
                        <button 
                          className="repair-button"
                          onClick={() => handleRepair(item)}
                          disabled={!gameState || gameState.money < calculateRepairCost(item)}
                        >
                          <FaTools className="repair-icon" />
                          <span>Reparar</span>
                        </button>
                      </div>
                    )}
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