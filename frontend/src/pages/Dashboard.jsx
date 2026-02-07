export default function Dashboard({
  selectedTorneo,
  stats,
  upcoming,
  tabla,
  activity,
  equiposById,
}) {
  return (
    <div className="page">
      <header className="topbar">
        <div>
          <div className="eyebrow">Resumen general</div>
          <h1>Dashboard</h1>
          <div className="muted">{selectedTorneo ? selectedTorneo.nombre : 'Sin torneo seleccionado'}</div>
        </div>
        <div className="avatar">JD</div>
      </header>

      <section className="stats">
        {stats.map((s) => (
          <div key={s.label} className="card stat">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-trend">{s.trend}</div>
          </div>
        ))}
      </section>

      <section className="grid">
        <div className="card wide">
          <div className="card-header">
            <div>
              <div className="eyebrow">Calendario</div>
              <h2>Próximos partidos</h2>
            </div>
          </div>
          <div className="list">
            {upcoming.length === 0 && <div className="muted">No hay partidos pendientes</div>}
            {upcoming.map((m) => (
              <div key={m.id} className="list-item">
                <div className="match-id">{m.id}</div>
                <div className="match">
                  <div className="teams">
                    <span>{equiposById.get(m.equipoLocalId) || m.equipoLocalId}</span>
                    <span className="vs">vs</span>
                    <span>{equiposById.get(m.equipoVisitanteId) || m.equipoVisitanteId}</span>
                  </div>
                  <div className="meta">{formatDate(m.fechaProgramada) || 'Sin fecha'} · Jornada {m.jornada}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="eyebrow">Tabla</div>
              <h2>Top 4</h2>
            </div>
          </div>
          <div className="table">
            <div className="table-head">
              <span>Pos</span>
              <span>Equipo</span>
              <span>PJ</span>
              <span>DG</span>
              <span>Pts</span>
            </div>
            {tabla.slice(0, 4).map((t, idx) => (
              <div key={t.equipoId} className="table-row">
                <span className="pill">{idx + 1}</span>
                <span>{t.nombreEquipo}</span>
                <span>{t.partidosJugados}</span>
                <span>{t.diferenciaGoles}</span>
                <span className="strong">{t.puntos}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="eyebrow">Actividad</div>
              <h2>Últimos cambios</h2>
            </div>
          </div>
          <div className="timeline">
            {activity.length === 0 && <div className="muted">Sin actividad reciente</div>}
            {activity.map((a, i) => (
              <div key={i} className="timeline-item">
                <div className="time">{a.when}</div>
                <div className="text">{a.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function formatDate(value) {
  if (!value) return ''
  try {
    const date = new Date(value)
    return date.toLocaleString()
  } catch {
    return value
  }
}
