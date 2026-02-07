import { NavLink } from 'react-router-dom'

export default function Sidebar({ torneos, selectedTorneoId, onSelectTorneo }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">TF</div>
        <div>
          <div className="brand-title">TorneoFutbol</div>
          <div className="brand-sub">Panel de control</div>
        </div>
      </div>

      <div className="selector">
        <label>Seleccionar torneo</label>
        <select value={selectedTorneoId} onChange={(e) => onSelectTorneo(e.target.value)}>
          {torneos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre} · {t.estado}
            </option>
          ))}
        </select>
      </div>

      <nav className="nav">
        <NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to="/">
          <span className="dot" />
          Dashboard
        </NavLink>
        <NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to="/torneos">
          Torneos
        </NavLink>
        <NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to="/equipos">
          Equipos
        </NavLink>
        <NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to="/partidos">
          Partidos
        </NavLink>
        <NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to="/tabla">
          Tabla de posiciones
        </NavLink>
        <NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to="/config">
          Configuración
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="badge">Temporada 2026</div>
      </div>
    </aside>
  )
}
