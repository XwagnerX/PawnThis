import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainMenu.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [sessionTime, setSessionTime] = useState('');

  useEffect(() => {
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const diff = now - parseInt(loginTime, 10);
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setSessionTime(`${minutes} min ${seconds} seg`);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  // Volver al menú principal (MainMenu.jsx)
  const handleGoToMenu = () => {
    navigate('/');
  };

  if (!user) return <p>No has iniciado sesión.</p>;

  return (
    <div className="profile-bg">
      <div
        className="menu-content"
        style={{
          color: '#FEFFD4',
          marginTop: '180px'
        }}
      >
        <h2 style={{ color: '#000', marginBottom: '1.5rem' }}>Perfil de Usuario</h2>
        <div className="menu-buttons" style={{ gap: '0.5rem', color: '#FEFFD4' }}>
          <p>
            <span style={{ fontWeight: 'bold', color: '#FEFFD4' }}>Nombre:</span> {user.nombre} {user.apellido}
          </p>
          <p>
            <span style={{ fontWeight: 'bold', color: '#FEFFD4' }}>Email:</span> {user.email}
          </p>
          <p>
            <span style={{ fontWeight: 'bold', color: '#FEFFD4' }}>Tiempo con la sesión iniciada:</span> {sessionTime}
          </p>
          <button
            className="menu-button"
            style={{
              backgroundColor: '#FEFFD4',
              color: '#3F1518',
              fontWeight: 'bold',
              marginTop: '1.5rem'
            }}
            onClick={handleGoToMenu}
          >
            Volver al menú principal
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 