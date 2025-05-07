import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import MainMenu from './components/MainMenu'
import Login from './components/Login'
import Register from './components/Register'
import GameScene from './components/game/GameScene'
import ClientNegotiation from './components/game/ClientNegotiation'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game" element={<GameScene />} />
        <Route path="/game/negotiation" element={<ClientNegotiation />} />
      </Routes>
    </Router>
  )
}

export default App
