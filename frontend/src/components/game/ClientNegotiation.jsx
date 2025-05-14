import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ClientNegotiation.css';
import fondo1 from '../../assets/imagesfondo/TungSahur1.png';
import fondo2 from '../../assets/imagesfondo/TungSahur2.png';
import fondo3 from '../../assets/imagesfondo/TungSahur3.png';
import ficha1 from '../../assets/images/Ficha1.png';
import ficha5 from '../../assets/images/Ficha5.png';
import ficha20 from '../../assets/images/Ficha20.png';
import ficha100 from '../../assets/images/Ficha100.png';

const ClientNegotiation = () => {
  const navigate = useNavigate();
  const [price, setPrice] = useState(100);
  const [customPrice, setCustomPrice] = useState('');
  const [offerSent, setOfferSent] = useState(false);

  useEffect(() => {
    const scene = document.querySelector('.negotiation-scene');
    const fondos = [fondo1, fondo2, fondo3];
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