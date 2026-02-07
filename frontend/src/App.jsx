import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import TorneosPage from './pages/Torneos.jsx'
import EquiposPage from './pages/Equipos.jsx'
import PartidosPage from './pages/Partidos.jsx'
import TablaPage from './pages/Tabla.jsx'
import ConfigPage from './pages/Config.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

async function apiGet(path) {
  const res = await fetch(`${API}${path}`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

async function apiPost(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.status === 204 ? null : res.json()
}

async function apiPut(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.status === 204 ? null : res.json()
}

const initialTorneoForm = {
  nombre: '',
  maxJugadoresPorEquipo: 15,
  puntosVictoria: 3,
  puntosEmpate: 1,
  puntosDerrota: 0,
}

export default function App() {
  const [torneos, setTorneos] = useState([])
  const [selectedTorneoId, setSelectedTorneoId] = useState('')
  const [equipos, setEquipos] = useState([])
  const [selectedEquipoId, setSelectedEquipoId] = useState('')
  const [jugadores, setJugadores] = useState([])
  const [partidos, setPartidos] = useState([])
  const [tabla, setTabla] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [torneoForm, setTorneoForm] = useState(initialTorneoForm)
  const [equipoForm, setEquipoForm] = useState({ nombre: '', delegadoEmail: '' })
  const [jugadorForm, setJugadorForm] = useState({ nombre: '', numeroCamiseta: 1 })
  const [programarForm, setProgramarForm] = useState({ partidoId: '', fechaProgramada: '' })
  const [resultadoForm, setResultadoForm] = useState({ partidoId: '', golesLocal: 0, golesVisitante: 0 })
  const [modalState, setModalState] = useState({ open: false, mode: 'create', torneoId: null })

  const selectedTorneo = useMemo(
    () => torneos.find((t) => t.id === selectedTorneoId),
    [torneos, selectedTorneoId]
  )

  const equiposById = useMemo(() => {
    const map = new Map()
    equipos.forEach((e) => map.set(e.id, e.nombre))
    return map
  }, [equipos])

  useEffect(() => {
    loadTorneos()
  }, [])

  useEffect(() => {
    if (!selectedTorneoId) return
    loadEquipos(selectedTorneoId)
    loadPartidos(selectedTorneoId)
    loadTabla(selectedTorneoId)
  }, [selectedTorneoId])

  useEffect(() => {
    if (!selectedTorneoId || !selectedEquipoId) {
      setJugadores([])
      return
    }
    loadJugadores(selectedTorneoId, selectedEquipoId)
  }, [selectedTorneoId, selectedEquipoId])

  const stats = useMemo(() => {
    const activos = torneos.filter((t) => t.estado !== 'FINALIZADO').length
    const equiposCount = tabla.length
    const jugados = partidos.filter((p) => p.resultado !== 'PENDIENTE').length
    const golesTotales = partidos.reduce((acc, p) => acc + p.golesLocal + p.golesVisitante, 0)
    return [
      { label: 'Torneos activos', value: String(activos), trend: `${torneos.length} totales` },
      { label: 'Equipos inscritos', value: String(equiposCount), trend: selectedTorneo ? selectedTorneo.nombre : 'Selecciona torneo' },
      { label: 'Partidos jugados', value: String(jugados), trend: `${partidos.length} programados` },
      { label: 'Goles totales', value: String(golesTotales), trend: partidos.length ? `Promedio ${(golesTotales / partidos.length).toFixed(1)}` : 'Sin partidos' },
    ]
  }, [torneos, tabla, partidos, selectedTorneo])

  const upcoming = useMemo(() => {
    return partidos
      .filter((p) => p.resultado === 'PENDIENTE')
      .sort((a, b) => (a.fechaProgramada || '').localeCompare(b.fechaProgramada || ''))
      .slice(0, 3)
  }, [partidos])

  function addActivity(text) {
    setActivity((prev) => [{ when: 'Hace un momento', text }, ...prev].slice(0, 6))
  }

  async function loadTorneos() {
    try {
      setLoading(true)
      const data = await apiGet('/torneos')
      setTorneos(data)
      if (!selectedTorneoId && data.length) {
        setSelectedTorneoId(data[0].id)
      }
    } catch (e) {
      setError(normalizeError(e))
    } finally {
      setLoading(false)
    }
  }

  async function loadEquipos(torneoId) {
    try {
      const data = await apiGet(`/torneos/${torneoId}/equipos`)
      setEquipos(data)
      if (!data.find((e) => e.id === selectedEquipoId)) {
        setSelectedEquipoId(data[0]?.id || '')
      }
    } catch (e) {
      setError(normalizeError(e))
    }
  }

  async function loadJugadores(torneoId, equipoId) {
    try {
      const data = await apiGet(`/torneos/${torneoId}/equipos/${equipoId}/jugadores`)
      setJugadores(data)
    } catch (e) {
      setError(normalizeError(e))
    }
  }

  async function loadPartidos(torneoId) {
    try {
      const data = await apiGet(`/partidos/torneo/${torneoId}`)
      setPartidos(data)
    } catch (e) {
      setError(normalizeError(e))
    }
  }

  async function loadTabla(torneoId) {
    try {
      const data = await apiGet(`/torneos/${torneoId}/tabla`)
      setTabla(data)
    } catch (e) {
      setError(normalizeError(e))
    }
  }

  async function handleCrearTorneo(e) {
    e.preventDefault()
    try {
      setSuccess('')
      setError('')
      const created = await apiPost('/torneos', torneoForm)
      setTorneos((prev) => [created, ...prev])
      setSelectedTorneoId(created.id)
      setTorneoForm(initialTorneoForm)
      addActivity(`Nuevo torneo creado: ${created.nombre}`)
      setSuccess('Torneo creado')
      setModalState({ open: false, mode: 'create', torneoId: null })
    } catch (e) {
      setError(normalizeError(e))
    }
  }

  async function handleActualizarTorneo(torneoId, data) {
    try {
      setSuccess('')
      setError('')
      const updated = await apiPut(`/torneos/${torneoId}`, data)
      setTorneos((prev) => prev.map((t) => (t.id === torneoId ? updated : t)))
      addActivity(`Torneo actualizado: ${updated.nombre}`)
      setSuccess('Torneo actualizado')
    } catch (e) {
      setError(normalizeError(e))
    }
  }

  async function handleInscribirEquipo(e) {
    e.preventDefault()
    if (!selectedTorneoId) return
    try {
      setSuccess('')
      setError('')
      const equipo = await apiPost(`/torneos/${selectedTorneoId}/equipos`, equipoForm)
      setEquipos((prev) => [equipo, ...prev])
      setEquipoForm({ nombre: '', delegadoEmail: '' })
      addActivity(`Equipo inscrito: ${equipo.nombre}`)
      setSuccess('Equipo inscrito')
      await loadTabla(selectedTorneoId)
    } catch (e) {
      setError(normalizeError(e))
    }
  }

  async function handleInscribirJugador(e) {
    e.preventDefault()
    if (!selectedTorneoId || !selectedEquipoId) return
    try {
      setSuccess('')
      setError('')
      const jugador = await apiPost(`/torneos/${selectedTorneoId}/equipos/${selectedEquipoId}/jugadores`, jugadorForm)
      setJugadorForm({ nombre: '', numeroCamiseta: 1 })
      addActivity(`Jugador inscrito: ${jugador.nombre}`)
      setSuccess('Jugador inscrito')
      await loadJugadores(selectedTorneoId, selectedEquipoId)
    } catch (e) {
      setError(normalizeError(e))
    }
  }

  async function handleProgramarPartido(e) {
    e.preventDefault()
    if (!programarForm.partidoId || !programarForm.fechaProgramada) return
    try {
      setSuccess('')
      setError('')
      await apiPut(`/partidos/${programarForm.partidoId}/programar`, {
        fechaProgramada: programarForm.fechaProgramada,
      })
      addActivity(`Partido programado: ${programarForm.partidoId}`)
      setProgramarForm({ partidoId: '', fechaProgramada: '' })
      await loadPartidos(selectedTorneoId)
      setSuccess('Partido programado')
    } catch (e) {
      setError(normalizeError(e))
    }
  }

  async function handleRegistrarResultado(e) {
    e.preventDefault()
    if (!resultadoForm.partidoId) return
    try {
      setSuccess('')
      setError('')
      await apiPut(`/partidos/${resultadoForm.partidoId}/resultado`, {
        golesLocal: Number(resultadoForm.golesLocal),
        golesVisitante: Number(resultadoForm.golesVisitante),
      })
      addActivity(`Resultado registrado: ${resultadoForm.partidoId}`)
      setResultadoForm({ partidoId: '', golesLocal: 0, golesVisitante: 0 })
      await loadPartidos(selectedTorneoId)
      await loadTabla(selectedTorneoId)
      setSuccess('Resultado registrado')
    } catch (e) {
      setError(normalizeError(e))
    }
  }

  async function handleAction(torneoId, path, label) {
    if (!torneoId) return
    try {
      setSuccess('')
      setError('')
      await apiPost(`/torneos/${torneoId}/${path}`)
      addActivity(label)
      await loadTorneos()
      await loadTabla(torneoId)
      setSuccess(label)
    } catch (e) {
      setError(normalizeError(e))
    }
  }

  return (
    <div className="app">
      <Sidebar
        torneos={torneos}
        selectedTorneoId={selectedTorneoId}
        onSelectTorneo={setSelectedTorneoId}
      />

      <main className="content">
        {loading && <div className="banner">Cargando datos...</div>}
        {error && <div className="banner error">{error}</div>}
        {success && <div className="banner success">{success}</div>}

        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                selectedTorneo={selectedTorneo}
                stats={stats}
                upcoming={upcoming}
                tabla={tabla}
                activity={activity}
                equiposById={equiposById}
              />
            }
          />
          <Route
            path="/torneos"
            element={
              <TorneosPage
                torneos={torneos}
                selectedTorneoId={selectedTorneoId}
                onSelectTorneo={setSelectedTorneoId}
                torneoForm={torneoForm}
                setTorneoForm={setTorneoForm}
                onCrearTorneo={handleCrearTorneo}
                onActualizarTorneo={handleActualizarTorneo}
                onAccionTorneo={handleAction}
                modalState={modalState}
                setModalState={setModalState}
              />
            }
          />
          <Route
            path="/equipos"
            element={
              <EquiposPage
                equipos={equipos}
                jugadores={jugadores}
                selectedEquipoId={selectedEquipoId}
                onSelectEquipo={setSelectedEquipoId}
                equipoForm={equipoForm}
                setEquipoForm={setEquipoForm}
                onInscribirEquipo={handleInscribirEquipo}
                jugadorForm={jugadorForm}
                setJugadorForm={setJugadorForm}
                onInscribirJugador={handleInscribirJugador}
              />
            }
          />
          <Route
            path="/partidos"
            element={
              <PartidosPage
                partidos={partidos}
                equiposById={equiposById}
                programarForm={programarForm}
                setProgramarForm={setProgramarForm}
                onProgramarPartido={handleProgramarPartido}
                resultadoForm={resultadoForm}
                setResultadoForm={setResultadoForm}
                onRegistrarResultado={handleRegistrarResultado}
              />
            }
          />
          <Route path="/tabla" element={<TablaPage tabla={tabla} />} />
          <Route path="/config" element={<ConfigPage apiUrl={API} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function normalizeError(e) {
  if (!e) return 'Error inesperado'
  if (typeof e === 'string') return e
  if (e.message) return e.message
  return 'Error inesperado'
}
