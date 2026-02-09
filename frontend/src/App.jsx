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
import TablaPage from './pages/Tabla.jsx'
import ConfigPage from './pages/Config.jsx'

import './App.css'

export default function App() {
  const [selectedTorneoId, setSelectedTorneoId] = useState('')

  const { data: torneos = [], isLoading, isError, error } = useQuery({
    queryKey: ['torneos'],
    queryFn: () => apiGet('/torneos'),
  })

  useEffect(() => {
    // Select the first tournament by default
    if (!selectedTorneoId && torneos.length > 0) {
      setSelectedTorneoId(torneos[0].id)
    }
  }, [torneos, selectedTorneoId])

  return (
    <div className="app-container">
      <Sidebar
        torneos={torneos}
        selectedTorneoId={selectedTorneoId}
        onSelectTorneo={setSelectedTorneoId}
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
                <Route path="/" element={<Dashboard selectedTorneoId={selectedTorneoId} />} />
                <Route path="/torneos" element={<TorneosPage selectedTorneoId={selectedTorneoId} onSelectTorneo={setSelectedTorneoId} />} />
                <Route path="/equipos" element={<EquiposPage selectedTorneoId={selectedTorneoId} />} />
                <Route path="/partidos" element={<PartidosPage selectedTorneoId={selectedTorneoId} />} />
                <Route path="/tabla" element={<TablaPage selectedTorneoId={selectedTorneoId} />} />
                <Route path="/config" element={<ConfigPage apiUrl={import.meta.env.VITE_API_URL || 'http://localhost:8080/api'} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}