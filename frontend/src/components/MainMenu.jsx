import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainMenu.css';

const MainMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="main-menu">
      <div className="auth-icons">
        <button 
          className="auth-icon-button" 
          onClick={() => navigate('/login')}
        >
          <i className="fas fa-sign-in-alt"></i>
          <span>Iniciar Sesión</span>
        </button>
        <button 
          className="auth-icon-button" 
          onClick={() => navigate('/register')}
        >
          <i className="fas fa-user-plus"></i>
          <span>Registrarse</span>
        </button>
      </div>
      <div className="menu-content">
        <h1>PawnThis</h1>
        <div className="menu-buttons">
          <button 
            className="menu-button"
            onClick={() => navigate('/game')}
          >
            Nueva Partida
          </button>
          <button className="menu-button">Continuar</button>
          <button className="menu-button">Ajustes</button>
        </div>
      </div>
    </div>
  );
};

export default MainMenu; 