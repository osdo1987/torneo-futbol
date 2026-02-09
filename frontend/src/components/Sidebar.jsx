import { NavLink } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import {
  HouseDoor,
  Trophy,
  People,
  CalendarEvent,
  Table,
  Gear,
  TrophyFill
} from 'react-bootstrap-icons'

export default function Sidebar({ torneos = [], selectedTorneoId, onSelectTorneo }) {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <TrophyFill size={20} color="white" />
        </div>
        <span className="h4 mb-0 text-white">Torneo Pro</span>
      </div>

      <div className="mb-4">
        <small className="text-muted text-uppercase fw-bold mb-2 d-block" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
          Torneo Activo
        </small>
        <Form.Select
          value={selectedTorneoId}
          onChange={(e) => onSelectTorneo(e.target.value)}
          className="bg-dark text-white border-secondary border-opacity-25"
          style={{ fontSize: '0.9rem' }}
        >
          {torneos.length === 0 && <option value="">No hay torneos</option>}
          {torneos.map((t) => (
            <option key={t.id} value={t.id} className="text-dark">
              {t.nombre}
            </option>
          ))}
        </Form.Select>
      </div>

      <nav className="sidebar-nav">
        <small className="text-muted text-uppercase fw-bold mb-2 d-block" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
          Menú Principal
        </small>

        <NavLink to="/" end className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <HouseDoor size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/torneos" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <Trophy size={18} />
          <span>Torneos</span>
        </NavLink>

        <NavLink to="/equipos" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <People size={18} />
          <span>Equipos</span>
        </NavLink>

        <NavLink to="/partidos" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <CalendarEvent size={18} />
          <span>Partidos</span>
        </NavLink>

        <NavLink to="/tabla" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <Table size={18} />
          <span>Posiciones</span>
        </NavLink>

        <div className="mt-4">
          <small className="text-muted text-uppercase fw-bold mb-2 d-block" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
            Sistema
          </small>
          <NavLink to="/config" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
            <Gear size={18} />
            <span>Configuración</span>
          </NavLink>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-primary-accent rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
            <span className="fw-bold" style={{ fontSize: '0.75rem' }}>AD</span>
          </div>
          <div className="overflow-hidden">
            <p className="mb-0 fw-semibold text-white text-truncate" style={{ fontSize: '0.85rem' }}>Administrador</p>
            <p className="mb-0 text-muted text-truncate" style={{ fontSize: '0.75rem' }}>v2.0.4</p>
          </div>
        </div>
      </div>
    </div>
  )
}