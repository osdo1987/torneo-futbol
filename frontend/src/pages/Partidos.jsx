import { useMemo, useState } from 'react'

export default function PartidosPage({
  partidos,
  equiposById,
  programarForm,
  setProgramarForm,
  onProgramarPartido,
  resultadoForm,
  setResultadoForm,
  onRegistrarResultado,
}) {
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const [jornadaFiltro, setJornadaFiltro] = useState('')

  const partidosFiltrados = useMemo(() => {
    return partidos.filter((p) => {
      const matchEstado = estadoFiltro ? p.resultado === estadoFiltro : true
      const matchJornada = jornadaFiltro ? String(p.jornada) === String(jornadaFiltro) : true
      return matchEstado && matchJornada
    })
  }, [partidos, estadoFiltro, jornadaFiltro])

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Operación</div>
          <h1>Partidos</h1>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Gestión de partidos</h2>
        </div>

        <div className="split forms-top">
          <form onSubmit={onProgramarPartido} className="form">
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
            <button className="btn block secondary" type="submit">Programar</button>
          </form>

          <form onSubmit={onRegistrarResultado} className="form">
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
            <div className="row">
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
            <button className="btn block ghost" type="submit">Registrar resultado</button>
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
        <div className="table">
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
              <span>{p.resultado}</span>
            </div>
          ))}
          {partidosFiltrados.length === 0 && (
            <div className="muted">No hay partidos con esos filtros.</div>
          )}
        </div>
      </div>
    </div>
  )
}
