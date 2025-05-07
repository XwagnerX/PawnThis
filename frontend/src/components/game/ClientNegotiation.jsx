import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ClientNegotiation.css';
import fondo1 from '../../assets/imagesfondo/TungSahur1.png';
import fondo2 from '../../assets/imagesfondo/TungSahur2.png';

const ClientNegotiation = () => {
  const navigate = useNavigate();
  const [price, setPrice] = useState(100);
  const [customPrice, setCustomPrice] = useState('');
  const [offerSent, setOfferSent] = useState(false);

  useEffect(() => {
    const scene = document.querySelector('.negotiation-scene');
    const fondos = [fondo1, fondo2];
    const fondoAleatorio = fondos[Math.floor(Math.random() * fondos.length)];
    scene.style.backgroundImage = `url(${fondoAleatorio})`;
  }, []);

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

  const handleOffer = () => {
    setOfferSent(true);
    setTimeout(() => setOfferSent(false), 1500);
  };

  return (
    <div className="negotiation-scene">
      <div className="negotiation-content">
        <div className="client-info">
          <h2>Cliente</h2>
          <div className="item-details">
            <h3>Objeto: Reloj Antiguo</h3>
            <p>Estado: Bueno</p>
            <p>Precio solicitado: $150</p>
          </div>
        </div>

        <div className="negotiation-controls">
          <div className="price-controls">
            <button 
              className="price-button"
              onClick={() => handlePriceChange(-10)}
            >
              -10
            </button>
            <button 
              className="price-button"
              onClick={() => handlePriceChange(-5)}
            >
              -5
            </button>
            <span className="current-price">${price}</span>
            <button 
              className="price-button"
              onClick={() => handlePriceChange(5)}
            >
              +5
            </button>
            <button 
              className="price-button"
              onClick={() => handlePriceChange(10)}
            >
              +10
            </button>
          </div>

          <form onSubmit={handleCustomPrice} className="custom-price-form">
            <input
              type="number"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              placeholder="Precio personalizado"
              min="0"
            />
            <button type="submit" className="custom-price-button">
              Establecer Precio
            </button>
          </form>

          <button 
            className="offer-button"
            onClick={handleOffer}
            disabled={offerSent}
          >
            {offerSent ? 'Oferta Enviada!' : 'Hacer Oferta'}
          </button>

          <div className="action-buttons">
            <button 
              className="action-button reject"
              onClick={() => navigate('/game')}
            >
              Rechazar
            </button>
            <button 
              className="action-button accept"
              onClick={() => navigate('/game')}
            >
              Trato Hecho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientNegotiation; 