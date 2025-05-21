import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/MainMenu.css';

const MainMenu = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [hasActiveGame, setHasActiveGame] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  useEffect(() => {
    checkActiveGame();
  }, []);

  const checkActiveGame = async () => {
    try {
      await axios.get('/api/game/state');
      setHasActiveGame(true);
    } catch (error) {
      setHasActiveGame(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('gameState');
    localStorage.removeItem('loginTime');
    setUser(null);
    navigate('/');
  };

  const handleNewGame = async () => {
    try {
      await axios.post('/api/game/new');
      setHasActiveGame(true);
      navigate('/game');
    } catch (error) {
      if (error.response?.data?.hasActiveGame) {
        setShowConfirmDialog(true);
      } else {
        alert('Error al crear nueva partida');
      }
    }
  };

  const handleContinueGame = () => {
    navigate('/game');
  };

  const handleConfirmNewGame = async () => {
    try {
      await axios.put('/api/game/deactivate');
      await axios.post('/api/game/new');
      setShowConfirmDialog(false);
      setHasActiveGame(true);
      navigate('/game');
    } catch (error) {
      alert('Error al iniciar nueva partida');
    }
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
          {hasActiveGame && (
            <button className="menu-button" onClick={handleContinueGame}>
              <i className="fas fa-play"></i> Continuar
            </button>
          )}
          <button className="menu-button" onClick={handleNewGame}>
            <i className="fas fa-plus"></i> Nueva Partida
          </button>
          <button className="menu-button">Ajustes</button>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>¿Estás seguro?</h2>
            <p>Ya tienes una partida en progreso. Si inicias una nueva partida, perderás tu progreso actual.</p>
            <div className="modal-buttons">
              <button className="modal-button confirm" onClick={handleConfirmNewGame}>
                Sí, iniciar nueva partida
              </button>
              <button className="modal-button cancel" onClick={() => setShowConfirmDialog(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainMenu; 