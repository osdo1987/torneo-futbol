import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap'

import { apiGet } from './api'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import TorneosPage from './pages/Torneos.jsx'
import EquiposPage from './pages/Equipos.jsx'
import PartidosPage from './pages/Partidos.jsx'
import TablaPage from './pages/Tabla.jsx'
import ConfigPage from './pages/Config.jsx'

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
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="p-0">
          <Sidebar
            torneos={torneos}
            selectedTorneoId={selectedTorneoId}
            onSelectTorneo={setSelectedTorneoId}
          />
        </Col>
        <Col md={9} lg={10}>
          <main className="p-4">
            {isLoading && <Spinner animation="border" variant="primary" />}
            {isError && <Alert variant="danger">Error: {error.message}</Alert>}
            
            <Routes>
              <Route path="/" element={<Dashboard selectedTorneoId={selectedTorneoId} />} />
              <Route path="/torneos" element={<TorneosPage selectedTorneoId={selectedTorneoId} onSelectTorneo={setSelectedTorneoId} />} />
              <Route path="/equipos" element={<EquiposPage selectedTorneoId={selectedTorneoId} />} />
              <Route path="/partidos" element={<PartidosPage selectedTorneoId={selectedTorneoId} />} />
              <Route path="/tabla" element={<TablaPage selectedTorneoId={selectedTorneoId} />} />
              <Route path="/config" element={<ConfigPage apiUrl={import.meta.env.VITE_API_URL || 'http://localhost:8080/api'} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </Col>
      </Row>
    </Container>
  )
}