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
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Operación</div>
          <h1>Partidos</h1>
        </div>
      </div>

      <div className="split">
        <div className="card">
          <div className="card-header">
            <h2>Listado de partidos</h2>
          </div>
          <div className="table">
            <div className="table-head">
              <span>Jornada</span>
              <span>Local</span>
              <span>Visitante</span>
              <span>Fecha</span>
              <span>Estado</span>
            </div>
            {partidos.map((p) => (
              <div key={p.id} className="table-row">
                <span>{p.jornada}</span>
                <span>{equiposById.get(p.equipoLocalId) || p.equipoLocalId}</span>
                <span>{equiposById.get(p.equipoVisitanteId) || p.equipoVisitanteId}</span>
                <span>{p.fechaProgramada ? new Date(p.fechaProgramada).toLocaleString() : 'Sin fecha'}</span>
                <span>{p.resultado}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Gestión de partidos</h2>
          </div>

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
    </div>
  )
}
