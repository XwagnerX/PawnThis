import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('loginTime', Date.now());
      navigate('/'); // Esto redirige al menú principal
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
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
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="auth-button">Iniciar Sesión</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
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