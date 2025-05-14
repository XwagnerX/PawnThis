import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import MainMenu from './components/MainMenu'
import Login from './components/Login'
import Register from './components/Register'
import GameScene from './components/game/GameScene'
import ClientNegotiation from './components/game/ClientNegotiation'
import Upgrades from './components/game/Upgrades'
import ShopWindow from './components/game/ShopWindow'
import Inventory from './components/game/Inventory'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game" element={<GameScene />} />
        <Route path="/game/negotiation" element={<ClientNegotiation />} />
        <Route path="/game/upgrades" element={<Upgrades />} />
        <Route path="/game/shop" element={<ShopWindow />} />
        <Route path="/game/inventory" element={<Inventory />} />
      </Routes>
    </Router>
  )
}

export default App
