import React, { useState } from 'react';
import axios from 'axios';

const GameStateManager = () => {
  const [gameState, setGameState] = useState('');
  const [message, setMessage] = useState('');

  // Guardar estado de partida
  const saveGameState = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/game-state', { state: { progreso: gameState } }, {
        headers: { 'x-access-token': token }
      });
      setMessage('Estado guardado correctamente');
    } catch (err) {
      setMessage('Error al guardar el estado');
    }
  };

  // Cargar estado de partida
  const loadGameState = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/game-state', {
        headers: { 'x-access-token': token }
      });
      setGameState(res.data.state.progreso || '');
      setMessage('Estado cargado correctamente');
    } catch (err) {
      setMessage('Error al cargar el estado');
    }
  };

  return (
    <div>
      <h3>Gestión de Estado de Partida</h3>
      <textarea
        value={gameState}
        onChange={e => setGameState(e.target.value)}
        placeholder="Aquí iría el JSON o datos de la partida"
        rows={4}
        cols={40}
      />
      <br />
      <button onClick={saveGameState}>Guardar Estado</button>
      <button onClick={loadGameState}>Cargar Estado</button>
      <p>{message}</p>
    </div>
  );
};

export default GameStateManager; 