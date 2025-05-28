import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../config/axios';
import '../../styles/ClientNegotiation.css';
import fondo1 from '../../assets/imagesfondo/TungSahur1.png';
import fondo2 from '../../assets/imagesfondo/TungSahur2.png';
import fondo3 from '../../assets/imagesfondo/TungSahur3.png';
import fondo4 from '../../assets/imagesfondo/TungSahur4.png';
import fondo5 from '../../assets/imagesfondo/TungSahur5.png';
import fondo6 from '../../assets/imagesfondo/TungSahur6.png';
import ficha1 from '../../assets/images/Ficha1.png';
import ficha5 from '../../assets/images/Ficha5.png';
import ficha20 from '../../assets/images/Ficha20.png';
import ficha100 from '../../assets/images/Ficha100.png';
import ItemCondition from '../common/ItemCondition';

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
  const fondos = [fondo1, fondo2, fondo3, fondo4, fondo5, fondo6];
  const [fondoAleatorio] = useState(fondos[Math.floor(Math.random() * fondos.length)]);
  const [offerAttempts, setOfferAttempts] = useState(0);
  const [isFinalResponse, setIsFinalResponse] = useState(false);

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
    // Permitir hasta 3 intentos de oferta en total (0, 1, 2)
    if (offerAttempts >= 3) return; 

    try {
      const response = await axios.post('/api/clients/evaluate-offer', {
        requestedPrice: client.item.requestedPrice,
        offeredPrice: price,
        personality: client.personality
      });
      
      const newOfferAttempts = offerAttempts + 1;
      setOfferAttempts(newOfferAttempts);

      const backendResponse = response.data;

      // Asegurar que 'difference' siempre esté presente en la respuesta del backend
      const safeBackendResponse = {
        ...backendResponse,
        difference: backendResponse.difference !== undefined && backendResponse.difference !== null ? backendResponse.difference : 0 // Usar la diferencia del backend si existe, o 0
      };

      if (safeBackendResponse.final) {
        setClientResponse(safeBackendResponse); // Usar la respuesta final segura
        setIsFinalResponse(true);
        setOfferSent(true); // Deshabilitar el botón de oferta
      } else if (newOfferAttempts >= 3) {
        // Si el cliente aún quería negociar (final: false) pero se agotaron los intentos
        // Creamos una respuesta final forzada en el frontend
        setClientResponse({
            accepted: false,
            response: "Lo siento, pero no me gusta tu oferta. Adiós.", // Mensaje de fin de intentos
            difference: safeBackendResponse.difference, // Usar la diferencia segura del backend
            negotiating: false,
            final: true // Marcar como final
        });
        setIsFinalResponse(true); // Forzar fin de negociación
        setOfferSent(true); // Deshabilitar el botón de oferta
      } else {
         // Si no es final y aún quedan intentos, mostrar la respuesta del backend y permitir seguir
         setClientResponse(safeBackendResponse); // Usar la respuesta de negociación segura
         setIsFinalResponse(false);
         setOfferSent(false); // Permitir seguir ofreciendo
      }

    } catch (error) {
      console.error('Error al evaluar oferta:', error);
      // En caso de error, establecer una respuesta de error final con difference inicializado
      setClientResponse({
        accepted: false,
        response: error.response?.data?.message || 'Error al evaluar la oferta',
        difference: 0, // Asegurar difference a 0 en caso de error
        negotiating: false,
        final: true
      });
      setError(error.response?.data?.message || 'Error al evaluar la oferta');
      setIsFinalResponse(true); // Forzar fin de negociación en caso de error
      setOfferSent(true); // Deshabilitar oferta en caso de error
    }
  };

  const handleDeal = async () => {
    // Solo permitir el trato si la última respuesta del cliente fue aceptada y es final
    if (!gameId || !client || !clientResponse || !clientResponse.accepted || !clientResponse.final) {
      setError('No se puede completar el trato en este momento.');
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
            <div className="condition-display">
              <span>Estado: </span>
              <ItemCondition condition={client.item.condition} />
            </div>
            <p>Precio solicitado: ${client.item.requestedPrice}</p>
            <p className="current-offer">Tu oferta actual: ${price}</p>
            {gameState && <p>Tu dinero: ${gameState.money}</p>}
            {clientResponse && (
              <div className="client-response">
                <p>Respuesta del cliente: {clientResponse.response}</p>
                {/* Mostrar diferencia solo si no es un rechazo inmediato o final no aceptado Y si 'difference' existe */}
                {(clientResponse.difference !== undefined && clientResponse.difference !== null) && (!clientResponse.final || clientResponse.accepted) ? (
                   <p>Diferencia con precio solicitado: {clientResponse.difference.toFixed(2)}%</p>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Mostrar controles de negociación solo si no es una respuesta final */}
        {!isFinalResponse && (
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
              disabled={offerAttempts >= 3} // Deshabilitar después de 3 intentos
            >
              {offerAttempts === 0 ? 'Establecer Oferta' : offerAttempts < 3 ? 'Hacer Otra Oferta' : 'Sin más intentos'}
            </button>
          </div>
        )}

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
            disabled={!clientResponse?.accepted || !clientResponse?.final || (gameState && gameState.money < price)} // Solo permitir Trato Hecho si la respuesta es aceptada y final, y tienes dinero
          >
            {!clientResponse ? 'Establece una Oferta' : 
             clientResponse.final ? (clientResponse.accepted ? 
               (gameState && gameState.money < price ? 'Sin Dinero Suficiente' : 'Trato Hecho') : 'Oferta Rechazada Final') :
               'Negociando...'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientNegotiation; 