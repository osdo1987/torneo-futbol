export default function TablaPage({ tabla }) {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Competencia</div>
          <h1>Tabla de posiciones</h1>
        </div>
      </div>

      <div className="card">
        <div className="table table-full">
          <div className="table-head">
            <span>Equipo</span>
            <span>PJ</span>
            <span>PG</span>
            <span>PE</span>
            <span>PP</span>
            <span>GF</span>
            <span>GC</span>
            <span>DG</span>
            <span>Pts</span>
          </div>
          {tabla.map((t) => (
            <div key={t.equipoId} className="table-row">
              <span>{t.nombreEquipo}</span>
              <span>{t.partidosJugados}</span>
              <span>{t.partidosGanados}</span>
              <span>{t.partidosEmpatados}</span>
              <span>{t.partidosPerdidos}</span>
              <span>{t.golesFavor}</span>
              <span>{t.golesContra}</span>
              <span>{t.diferenciaGoles}</span>
              <span className="strong">{t.puntos}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
