import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert, Spinner } from 'react-bootstrap'
import { apiGet, apiPut } from '../api'

const initialProgramarForm = { partidoId: '', fechaProgramada: '' }
const initialResultadoForm = { partidoId: '', golesLocal: 0, golesVisitante: 0 }

export default function PartidosPage({ selectedTorneoId }) {
  const queryClient = useQueryClient()
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const [jornadaFiltro, setJornadaFiltro] = useState('')
  const [programarForm, setProgramarForm] = useState(initialProgramarForm)
  const [resultadoForm, setResultadoForm] = useState(initialResultadoForm)

  const {
    data: partidos = [],
    isLoading: loadingPartidos,
    isError: isErrorPartidos,
    error: errorPartidos,
  } = useQuery({
    queryKey: ['partidos', selectedTorneoId],
    queryFn: () => apiGet(`/partidos/torneo/${selectedTorneoId}`),
    enabled: !!selectedTorneoId,
  })

  const {
    data: equipos = [],
    isLoading: loadingEquipos,
    isError: isErrorEquipos,
    error: errorEquipos,
  } = useQuery({
    queryKey: ['equipos', selectedTorneoId],
    queryFn: () => apiGet(`/torneos/${selectedTorneoId}/equipos`),
    enabled: !!selectedTorneoId,
  })

  const equiposById = useMemo(() => {
    return new Map(equipos.map((e) => [e.id, e.nombre]))
  }, [equipos])

  const partidosFiltrados = useMemo(() => {
    return partidos.filter((p) => {
      const matchEstado = estadoFiltro ? p.resultado === estadoFiltro : true
      const matchJornada = jornadaFiltro ? String(p.jornada) === String(jornadaFiltro) : true
      return matchEstado && matchJornada
    })
  }, [partidos, estadoFiltro, jornadaFiltro])

  const programarMutation = useMutation({
    mutationFn: ({ partidoId, fechaProgramada }) =>
      apiPut(`/partidos/${partidoId}/programar`, { fechaProgramada }),
    onSuccess: () => {
      queryClient.invalidateQueries(['partidos', selectedTorneoId])
      setProgramarForm(initialProgramarForm)
    },
  })

  const resultadoMutation = useMutation({
    mutationFn: ({ partidoId, golesLocal, golesVisitante }) =>
      apiPut(`/partidos/${partidoId}/resultado`, { golesLocal, golesVisitante }),
    onSuccess: () => {
      queryClient.invalidateQueries(['partidos', selectedTorneoId])
      queryClient.invalidateQueries(['tabla', selectedTorneoId])
      setResultadoForm(initialResultadoForm)
    },
  })

  const handleProgramar = (e) => {
    e.preventDefault()
    if (!programarForm.partidoId || !programarForm.fechaProgramada) return
    programarMutation.mutate(programarForm)
  }

  const handleResultado = (e) => {
    e.preventDefault()
    if (!resultadoForm.partidoId) return
    resultadoMutation.mutate(resultadoForm)
  }

  const estadoClass = (resultado) => {
    if (!resultado) return 'pendiente'
    return String(resultado).toLowerCase()
  }

  if (!selectedTorneoId) {
    return <Alert variant="info">Por favor, selecciona un torneo para gestionar los partidos.</Alert>
  }

  return (
    <div className="page partidos-page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Operación</div>
          <h1>Partidos</h1>
        </div>
      </div>

      {(loadingPartidos || loadingEquipos) && <Spinner animation="border" />}
      {isErrorPartidos && <Alert variant="danger">Error al cargar partidos: {errorPartidos.message}</Alert>}
      {isErrorEquipos && <Alert variant="danger">Error al cargar equipos: {errorEquipos.message}</Alert>}

      <div className="card">
        <div className="card-header">
          <h2>Gestión de partidos</h2>
        </div>

        <div className="split forms-top">
          <form onSubmit={handleProgramar} className="form">
            <div className="form-title">Programar partido</div>
            <select
              value={programarForm.partidoId}
              onChange={(e) => setProgramarForm({ ...programarForm, partidoId: e.target.value })}
            >
              <option value="">Seleccionar partido</option>
              {partidos.map((p) => (
                <option key={p.id} value={p.id}>
                  {equiposById.get(p.equipoLocalId) || p.equipoLocalId} vs {equiposById.get(p.equipoVisitanteId) || p.equipoVisitanteId}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={programarForm.fechaProgramada}
              onChange={(e) => setProgramarForm({ ...programarForm, fechaProgramada: e.target.value })}
            />
            <button className="btn block secondary" type="submit" disabled={programarMutation.isPending}>
              {programarMutation.isPending ? 'Programando...' : 'Programar'}
            </button>
            {programarMutation.isError && (
              <div className="muted">{programarMutation.error.message}</div>
            )}
          </form>

          <form onSubmit={handleResultado} className="form">
            <div className="form-title">Registrar resultado</div>
            <select
              value={resultadoForm.partidoId}
              onChange={(e) => setResultadoForm({ ...resultadoForm, partidoId: e.target.value })}
            >
              <option value="">Seleccionar partido</option>
              {partidos.map((p) => (
                <option key={p.id} value={p.id}>
                  {equiposById.get(p.equipoLocalId) || p.equipoLocalId} vs {equiposById.get(p.equipoVisitanteId) || p.equipoVisitanteId}
                </option>
              ))}
            </select>
            <div className="form-row">
              <input
                type="number"
                min="0"
                value={resultadoForm.golesLocal}
                onChange={(e) => setResultadoForm({ ...resultadoForm, golesLocal: Number(e.target.value) })}
                placeholder="Goles local"
              />
              <input
                type="number"
                min="0"
                value={resultadoForm.golesVisitante}
                onChange={(e) => setResultadoForm({ ...resultadoForm, golesVisitante: Number(e.target.value) })}
                placeholder="Goles visitante"
              />
            </div>
            <button className="btn block ghost" type="submit" disabled={resultadoMutation.isPending}>
              {resultadoMutation.isPending ? 'Registrando...' : 'Registrar resultado'}
            </button>
            {resultadoMutation.isError && (
              <div className="muted">{resultadoMutation.error.message}</div>
            )}
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h2>Listado de partidos</h2>
            <div className="muted">Filtra por jornada o estado.</div>
          </div>
          <div className="filters">
            <input
              className="filter-input"
              type="number"
              min="1"
              placeholder="Jornada"
              value={jornadaFiltro}
              onChange={(e) => setJornadaFiltro(e.target.value)}
            />
            <select
              className="filter-input"
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="LOCAL_GANO">Local ganó</option>
              <option value="VISITANTE_GANO">Visitante ganó</option>
              <option value="EMPATE">Empate</option>
            </select>
          </div>
        </div>
        <div className="table table-wide">
          <div className="table-head">
            <span>Jornada</span>
            <span>Local</span>
            <span>Visitante</span>
            <span>Fecha</span>
            <span>Estado</span>
          </div>
          {partidosFiltrados.map((p) => (
            <div key={p.id} className="table-row">
              <span>{p.jornada}</span>
              <span>{equiposById.get(p.equipoLocalId) || p.equipoLocalId}</span>
              <span>{equiposById.get(p.equipoVisitanteId) || p.equipoVisitanteId}</span>
              <span>{p.fechaProgramada ? new Date(p.fechaProgramada).toLocaleString() : 'Sin fecha'}</span>
              <span className={`status-chip ${estadoClass(p.resultado)}`}>{p.resultado}</span>
            </div>
          ))}
          {partidosFiltrados.length === 0 && (
            <div className="muted table-empty">No hay partidos con esos filtros.</div>
          )}
        </div>
      </div>
    </div>
  )
}
