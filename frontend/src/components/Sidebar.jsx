import { NavLink } from 'react-router-dom'
import { Form, Nav } from 'react-bootstrap'
import { HouseDoor, Trophy, People, CalendarEvent, Table, Gear } from 'react-bootstrap-icons'

export default function Sidebar({ torneos, selectedTorneoId, onSelectTorneo }) {
  // Defensive check for torneos
  if (!torneos) {
    torneos = []
  }
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light vh-100" style={{ width: 280 }}>
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <span className="fs-4">TorneoFutbol</span>
      </a>
      <hr />

      <div className="mb-3">
        <Form.Label>Seleccionar torneo</Form.Label>
        <Form.Select value={selectedTorneoId} onChange={(e) => onSelectTorneo(e.target.value)}>
          {torneos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre} - {t.estado}
            </option>
          ))}
        </Form.Select>
      </div>

      <Nav variant="pills" className="flex-column mb-auto">
        <Nav.Item>
          <Nav.Link as={NavLink} to="/" end>
            <HouseDoor className="me-2" />
            Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/torneos">
            <Trophy className="me-2" />
            Torneos
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/equipos">
            <People className="me-2" />
            Equipos
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/partidos">
            <CalendarEvent className="me-2" />
            Partidos
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/tabla">
            <Table className="me-2" />
            Tabla
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/config">
            <Gear className="me-2" />
            Configuración
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <hr />
      <div className="text-muted">
        <small>Temporada 2026</small>
      </div>
    </div>
  )
}