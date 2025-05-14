import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import MainMenu from './components/MainMenu'
import Login from './components/Login'
import Register from './components/Register'
import GameScene from './components/game/GameScene'
import ClientNegotiation from './components/game/ClientNegotiation'
import Upgrades from './components/game/Upgrades'
import ShopWindow from './components/game/ShopWindow'
import Inventory from './components/game/Inventory'
import UserProfile from './components/UserProfile'
import GameStateManager from './components/GameStateManager'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <GameScene />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game/negotiation"
          element={
            <ProtectedRoute>
              <ClientNegotiation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game/upgrades"
          element={
            <ProtectedRoute>
              <Upgrades />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game/shop"
          element={
            <ProtectedRoute>
              <ShopWindow />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route path="/perfil" element={<UserProfile />} />
        <Route path="/partida" element={<GameStateManager />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
