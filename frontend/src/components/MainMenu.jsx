import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainMenu.css';

const MainMenu = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  // Escucha cambios en localStorage (por ejemplo, login/logout en otras pestañas)
  useEffect(() => {
    const handleStorage = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // También actualiza el estado al volver al menú principal
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('gameState');
    localStorage.removeItem('loginTime');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="main-menu">
      <div className="auth-icons">
        {!user ? (
          <>
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
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="auth-icon-button"
              onClick={() => navigate('/perfil')}
              style={{ backgroundColor: '#3F1518', color: '#FEFFD4' }}
            >
              <i className="fas fa-user"></i>
              <span>{user.nombre} {user.apellido}</span>
            </button>
            <button 
              className="auth-icon-button"
              onClick={handleLogout}
              style={{ backgroundColor: '#8B0000' }}
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}
      </div>
      <div className="menu-content">
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