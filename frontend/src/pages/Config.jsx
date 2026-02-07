export default function ConfigPage({ apiUrl }) {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Sistema</div>
          <h1>Configuración</h1>
          <div className="muted">API actual: {apiUrl}</div>
        </div>
      </div>

      <div className="card">
        <h2>Entorno</h2>
        <div className="muted">Usa la variable `VITE_API_URL` en `frontend/.env` para cambiar la URL.</div>
      </div>
    </div>
  )
}
