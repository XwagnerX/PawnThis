import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../config/axios';
import '../../styles/ClientNegotiation.css';
import fondo1 from '../../assets/imagesfondo/TungSahur1.png';
import fondo2 from '../../assets/imagesfondo/TungSahur2.png';
import fondo3 from '../../assets/imagesfondo/TungSahur3.png';
import fondo4 from '../../assets/imagesfondo/TungSahur4.png';
import fondo5 from '../../assets/imagesfondo/TungSahur5.png';
import ficha1 from '../../assets/images/Ficha1.png';
import ficha5 from '../../assets/images/Ficha5.png';
import ficha20 from '../../assets/images/Ficha20.png';
import ficha100 from '../../assets/images/Ficha100.png';

const ClientNegotiation = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [price, setPrice] = useState(100);
  const [customPrice, setCustomPrice] = useState('');
  const [offerSent, setOfferSent] = useState(false);
  const [error, setError] = useState('');
  const [gameState, setGameState] = useState(null);
  const [client, setClient] = useState(null);
  const [clientResponse, setClientResponse] = useState(null);
  const fondos = [fondo1, fondo2, fondo3, fondo4, fondo5];
  const [fondoAleatorio] = useState(fondos[Math.floor(Math.random() * fondos.length)]);
  const [offerAttempts, setOfferAttempts] = useState(0);

  useEffect(() => {
    if (!gameId) {
      console.error('No gameId provided');
      navigate('/game');
      return;
    }

    // Cargar el estado del juego
    const loadGameState = async () => {
      try {
        const response = await axios.get(`/api/game/${gameId}`);
        setGameState(response.data);
      } catch (error) {
        console.error('Error al cargar el estado del juego:', error);
        setError('Error al cargar el estado del juego');
      }
    };

    // Obtener un nuevo cliente
    const getNewClient = async () => {
      try {
        const response = await axios.get('/api/clients/new');
        setClient(response.data);
        setPrice(response.data.item.requestedPrice);
      } catch (error) {
        console.error('Error al obtener cliente:', error);
        setError('Error al obtener cliente');
      }
    };

    loadGameState();
    getNewClient();
  }, [gameId, navigate]);

  const handlePriceChange = (amount) => {
    setPrice(prevPrice => Math.max(0, prevPrice + amount));
  };

  const handleCustomPrice = (e) => {
    e.preventDefault();
    const newPrice = parseInt(customPrice);
    if (!isNaN(newPrice) && newPrice >= 0) {
      setPrice(newPrice);
      setCustomPrice('');
    }
  };

  const handleOffer = async () => {
    if (!client) return;
    if (offerAttempts >= 2) return;
    try {
      const response = await axios.post('/api/clients/evaluate-offer', {
        requestedPrice: client.item.requestedPrice,
        offeredPrice: price,
        personality: client.personality
      });
      setClientResponse(response.data);
      setOfferSent(true);
      setOfferAttempts(attempts => attempts + 1);
    } catch (error) {
      console.error('Error al evaluar oferta:', error);
      setError('Error al evaluar la oferta');
    }
  };

  const handleDeal = async () => {
    if (!gameId || !client || !clientResponse) {
      setError('No se puede completar el trato');
      return;
    }

    if (!clientResponse.accepted) {
      setError('El cliente no ha aceptado la oferta');
      return;
    }

    if (!gameState || gameState.money < price) {
      setError('No tienes suficiente dinero');
      return;
    }

    try {
      setError('');
      
      // Crear el item
      const itemResponse = await axios.post('/api/items/purchase', {
        gameId,
        itemName: client.item.name,
        condition: client.item.condition,
        requestedPrice: client.item.requestedPrice,
        purchasePrice: price,
        category: client.item.category
      });

      // Actualizar el dinero del jugador
      const updatedGameState = {
        ...gameState,
        money: gameState.money - price
      };

      await axios.put(`/api/game/${gameId}`, updatedGameState);

      console.log('Trato completado exitosamente');
      navigate('/game');
    } catch (error) {
      console.error('Error en el trato:', error);
      setError(error.response?.data?.message || 'Error al procesar el trato');
    }
  };

  if (!client) {
    return <div className="loading">Cargando cliente...</div>;
  }

  return (
    <div className="negotiation-scene" style={{ backgroundImage: `url(${fondoAleatorio})` }}>
      <div className="negotiation-content">
        <div className="client-info">
          <h2>{client.name}</h2>
          <p className="personality">{client.personalityDescription}</p>
          <div className="item-details">
            <h3>Objeto: {client.item.name}</h3>
            <p>Estado: {client.item.condition}</p>
            <p>Precio solicitado: ${client.item.requestedPrice}</p>
            <p className="current-offer">Tu oferta actual: ${price}</p>
            {gameState && <p>Tu dinero: ${gameState.money}</p>}
            {clientResponse && (
              <div className="client-response">
                <p>{clientResponse.response}</p>
                <p>Diferencia: {clientResponse.difference.toFixed(2)}%</p>
              </div>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="negotiation-controls">
          <div className="price-chips-row">
            <div className="chips-group chips-group-left">
              <div className="chips-symbol chips-symbol-left">−</div>
              <div className="chips-group-row">
                <img src={ficha100} alt="-100" className="chip-img" onClick={() => handlePriceChange(-100)} />
                <img src={ficha20} alt="-20" className="chip-img" onClick={() => handlePriceChange(-20)} />
                <img src={ficha5} alt="-5" className="chip-img" onClick={() => handlePriceChange(-5)} />
                <img src={ficha1} alt="-1" className="chip-img" onClick={() => handlePriceChange(-1)} />
              </div>
            </div>
            <span className="current-price">${price}</span>
            <div className="chips-group chips-group-right">
              <div className="chips-symbol chips-symbol-right">+</div>
              <div className="chips-group-row">
                <img src={ficha1} alt="+1" className="chip-img" onClick={() => handlePriceChange(1)} />
                <img src={ficha5} alt="+5" className="chip-img" onClick={() => handlePriceChange(5)} />
                <img src={ficha20} alt="+20" className="chip-img" onClick={() => handlePriceChange(20)} />
                <img src={ficha100} alt="+100" className="chip-img" onClick={() => handlePriceChange(100)} />
              </div>
            </div>
          </div>

          <button 
            className="offer-button"
            onClick={handleOffer}
            disabled={offerSent && (clientResponse?.accepted || offerAttempts >= 2)}
          >
            {offerSent ? 'Oferta Establecida!' : 'Establecer Oferta'}
          </button>
        </div>

        <div className="action-buttons always-visible">
          <button 
            className="action-button reject"
            onClick={() => navigate('/game')}
          >
            Rechazar
          </button>
          <button 
            className="action-button accept"
            onClick={handleDeal}
            disabled={!offerSent || !clientResponse?.accepted || (gameState && gameState.money < price)}
          >
            {!offerSent ? 'Esperando Oferta' : 
              !clientResponse?.accepted ? (offerAttempts >= 2 ? 'Sin más intentos' : 'Oferta Rechazada') :
              gameState && gameState.money < price ? 'Sin Dinero Suficiente' :
              'Trato Hecho'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientNegotiation; 