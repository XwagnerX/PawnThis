import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí irá la lógica de inicio de sesión
    console.log('Login attempt:', formData);
  };

  return (
    <div className="auth-container">
      <button 
        className="back-button"
        onClick={() => navigate('/')}
      >
        <i className="fas fa-arrow-left"></i>
        <span>Volver</span>
      </button>
      <div className="auth-content">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="auth-button">Iniciar Sesión</button>
        </form>
        <p className="auth-link">
          ¿No tienes cuenta? 
          <span onClick={() => navigate('/register')}> Regístrate aquí</span>
        </p>
      </div>
    </div>
  );
};

export default Login; 