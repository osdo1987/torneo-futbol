import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Spinner, Alert } from 'react-bootstrap'

import { apiGet } from './api'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import TorneosPage from './pages/Torneos.jsx'
import EquiposPage from './pages/Equipos.jsx'
import PartidosPage from './pages/Partidos.jsx'
import ControlEnVivoPage from './pages/ControlEnVivo.jsx'
import PartidosEnVivoPage from './pages/PartidosEnVivo.jsx'
import TablaPage from './pages/Tabla.jsx'
import EstadisticasPage from './pages/Estadisticas.jsx'
import ConfigPage from './pages/Config.jsx'

import LoginPage from './pages/Login.jsx'

import './App.css'

export default function App() {
  const [selectedTorneoId, setSelectedTorneoId] = useState('')
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const { data: torneos = [], isLoading, isError, error } = useQuery({
    queryKey: ['torneos'],
    queryFn: () => apiGet('/torneos'),
  })

  useEffect(() => {
    if (!selectedTorneoId && torneos.length > 0) {
      setSelectedTorneoId(torneos[0].id)
    }
  }, [torneos, selectedTorneoId])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="app-container">
      <Sidebar
        torneos={torneos}
        selectedTorneoId={selectedTorneoId}
        onSelectTorneo={setSelectedTorneoId}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <div className="content-wrapper">
          {isLoading && (
            <div className="d-flex justify-content-center p-5">
              <Spinner animation="border" variant="primary" />
            </div>
          )}

          {isError && (
            <Alert variant="danger" className="border-0 shadow-sm">
              <Alert.Heading>Error de conexión</Alert.Heading>
              <p className="mb-0">{error.message}</p>
            </Alert>
          )}

          {!isLoading && !isError && (
            <div className="fade-in">
              <Routes>
                <Route path="/" element={<Dashboard selectedTorneoId={selectedTorneoId} user={user} />} />
                <Route path="/torneos" element={<TorneosPage selectedTorneoId={selectedTorneoId} onSelectTorneo={setSelectedTorneoId} user={user} />} />
                <Route path="/equipos" element={<EquiposPage selectedTorneoId={selectedTorneoId} user={user} />} />
                <Route path="/partidos" element={<PartidosPage selectedTorneoId={selectedTorneoId} user={user} />} />
                <Route path="/control-en-vivo" element={<ControlEnVivoPage selectedTorneoId={selectedTorneoId} user={user} />} />
                <Route path="/partidos-en-vivo" element={<PartidosEnVivoPage selectedTorneoId={selectedTorneoId} user={user} />} />
                <Route path="/tabla" element={<TablaPage selectedTorneoId={selectedTorneoId} user={user} />} />
                <Route path="/estadisticas" element={<EstadisticasPage selectedTorneoId={selectedTorneoId} user={user} />} />
                <Route path="/config" element={<ConfigPage apiUrl={import.meta.env.VITE_API_URL || 'http://localhost:8080/api'} user={user} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}