import { NavLink } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import {
  HouseDoor,
  Trophy,
  People,
  CalendarEvent,
  Table,
  Gear,
  TrophyFill,
  BarChart,
  BoxArrowRight,
  PersonCircle,
  Clock
} from 'react-bootstrap-icons'

export default function Sidebar({ torneos = [], selectedTorneoId, onSelectTorneo, user, onLogout }) {
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

        {user?.rol === 'ORGANIZADOR' && (
          <NavLink to="/torneos" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
            <Trophy size={18} />
            <span>Torneos</span>
          </NavLink>
        )}

        {(user?.rol === 'ORGANIZADOR' || user?.rol === 'DELEGADO') && (
          <NavLink to="/equipos" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
            <People size={18} />
            <span>Equipos</span>
          </NavLink>
        )}

        {(user?.rol === 'ORGANIZADOR' || user?.rol === 'ARBITRO') && (
          <>
            <NavLink to="/partidos" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
              <CalendarEvent size={18} />
              <span>Partidos</span>
            </NavLink>
            <NavLink to="/control-en-vivo" className={({ isActive }) => `nav-link-custom nav-link-submenu ${isActive ? 'active' : ''}`}>
              <Clock size={16} />
              <span>Control en Vivo</span>
            </NavLink>
          </>
        )}

        <NavLink to="/tabla" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <Table size={18} />
          <span>Posiciones</span>
        </NavLink>

        <NavLink to="/estadisticas" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <BarChart size={18} />
          <span>Estadísticas</span>
        </NavLink>

        {user?.rol === 'ORGANIZADOR' && (
          <div className="mt-4">
            <small className="text-muted text-uppercase fw-bold mb-2 d-block" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
              Sistema
            </small>
            <NavLink to="/config" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
              <Gear size={18} />
              <span>Configuración</span>
            </NavLink>
          </div>
        )}
      </nav>

      <div className="sidebar-footer border-top border-secondary border-opacity-10 pt-4">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2 overflow-hidden">
            <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center p-2" style={{ width: 32, height: 32 }}>
              <PersonCircle size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="mb-0 fw-bold text-white text-truncate small">{user?.username || 'Usuario'}</p>
              <p className="mb-0 text-muted text-truncate italic" style={{ fontSize: '0.65rem' }}>{user?.rol || 'Visitante'}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="btn btn-link text-muted p-0 shadow-none hover-text-danger"
            title="Cerrar Sesión"
          >
            <BoxArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}