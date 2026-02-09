import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Card,
  Col,
  Row,
  Spinner,
  Alert,
  Modal,
  Form,
  ListGroup,
  Badge,
} from 'react-bootstrap'
import { People, Plus, PersonPlus, ShieldFill, Envelope, PersonBadgeFill } from 'react-bootstrap-icons'
import { apiGet, apiPost } from '../api'

const initialEquipoForm = { nombre: '', delegadoEmail: '' }
const initialJugadorForm = { nombre: '', numeroCamiseta: 10, posicion: 'DELANTERO', altura: '', peso: '' }

function JugadoresPanel({ torneoId, equipo }) {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPosicion, setFilterPosicion] = useState('TODAS')

  const {
    data: jugadores = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['jugadores', torneoId, equipo.id],
    queryFn: () => apiGet(`/torneos/${torneoId}/equipos/${equipo.id}/jugadores`),
    enabled: !!torneoId && !!equipo.id,
  })

  const filteredJugadores = jugadores.filter(j => {
    const matchesSearch = j.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.numeroCamiseta.toString().includes(searchTerm)
    const matchesPos = filterPosicion === 'TODAS' || (j.atributosAdicionales?.posicion === filterPosicion)
    return matchesSearch && matchesPos
  })

  const mutation = useMutation({
    mutationFn: (newJugador) => {
      const { nombre, numeroCamiseta, ...extras } = newJugador;
      return apiPost(`/torneos/${torneoId}/equipos/${equipo.id}/jugadores`, {
        nombre,
        numeroCamiseta,
        atributosAdicionales: extras
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['jugadores', torneoId, equipo.id])
      setForm(initialJugadorForm)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(form)
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 rounded bg-primary bg-opacity-10 text-primary">
            <People size={20} />
          </div>
          <h5 className="mb-0 fw-bold">Jugadores de {equipo.nombre}</h5>
        </div>
        <Badge pill bg="primary" className="px-3 py-2 fw-semibold">
          {jugadores.length} Inscritos
        </Badge>
      </Card.Header>

      <Card.Body className="px-4 pb-4">
        {/* Filtros de Búsqueda */}
        <div className="mb-4 d-flex gap-2">
          <div className="position-relative flex-grow-1">
            <Form.Control
              placeholder="Buscar por nombre o dorsal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-light border-0 py-2 ps-4 shadow-none"
            />
          </div>
          <Form.Select
            style={{ width: '180px' }}
            className="bg-light border-0 shadow-none"
            value={filterPosicion}
            onChange={(e) => setFilterPosicion(e.target.value)}
          >
            <option value="TODAS">Todas las Posiciones</option>
            <option value="PORTERO">Porteros</option>
            <option value="DEFENSA">Defensas</option>
            <option value="MEDIOCAMPISTA">Volantes</option>
            <option value="DELANTERO">Delanteros</option>
          </Form.Select>
        </div>

        <div className="bg-light p-4 rounded-4 mb-4 border border-dashed">
          <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <PersonPlus size={18} /> Inscribir con Ficha Técnica
          </h6>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={5}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase">Nombre Completo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: Juan Pérez"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="border-0 shadow-none py-2"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase">Dorsal</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="99"
                    value={form.numeroCamiseta}
                    onChange={(e) => setForm({ ...form, numeroCamiseta: Number(e.target.value) })}
                    className="border-0 shadow-none py-2 text-center"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase">Posición</Form.Label>
                  <Form.Select
                    value={form.posicion}
                    onChange={(e) => setForm({ ...form, posicion: e.target.value })}
                    className="border-0 shadow-none py-2"
                  >
                    <option value="PORTERO">Portero</option>
                    <option value="DEFENSA">Defensa</option>
                    <option value="MEDIOCAMPISTA">Mediocampista</option>
                    <option value="DELANTERO">Delantero</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button variant="primary" type="submit" className="w-100 py-2 fw-bold" disabled={mutation.isPending}>
                  {mutation.isPending ? <Spinner size="sm" /> : 'Inscribir'}
                </Button>
              </Col>
            </Row>

            <Row className="g-3 mt-1">
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase">Altura (cm)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="175"
                    value={form.altura}
                    onChange={(e) => setForm({ ...form, altura: e.target.value })}
                    className="border-0 shadow-none py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase">Peso (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="70"
                    value={form.peso}
                    onChange={(e) => setForm({ ...form, peso: e.target.value })}
                    className="border-0 shadow-none py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Text className="text-muted small mt-4 d-block">
                  * La ficha técnica permite filtros avanzados en futuras versiones de scouteo.
                </Form.Text>
              </Col>
            </Row>

            {mutation.isError && <Alert variant="danger" className="mt-3 py-2 small border-0">{mutation.error.message}</Alert>}
          </Form>
        </div>

        <h6 className="fw-bold mb-3 text-uppercase text-muted small letter-spacing-1">Plantilla Actual y Fichas Técinicas</h6>

        {isLoading ? (
          <div className="text-center py-4"><Spinner animation="border" variant="primary" size="sm" /></div>
        ) : (
          <div className="row g-3">
            {jugadores.length === 0 && (
              <Col xs={12}>
                <div className="text-center py-5 text-muted bg-white rounded-3 border">
                  <People size={32} className="opacity-25 mb-2" />
                  <p className="mb-0">No hay jugadores en este equipo aún.</p>
                </div>
              </Col>
            )}
            {filteredJugadores.map((j) => (
              <Col md={6} key={j.id}>
                <div className="p-3 border rounded-3 bg-white hover-shadow transition-all border-start-4 border-start-primary">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary text-white fw-bold rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: 40, height: 40 }}>
                        {j.numeroCamiseta}
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">{j.nombre}</h6>
                        <Badge bg="light" text="primary" className="small border">{j.atributosAdicionales?.posicion || 'JUGADOR'}</Badge>
                      </div>
                    </div>
                    <Badge bg="success" className="rounded-pill px-2" style={{ fontSize: '0.6rem' }}>ACTIVO</Badge>
                  </div>
                  <div className="d-flex gap-3 mt-2 border-top pt-2">
                    <div className="small text-muted">H: <strong>{j.atributosAdicionales?.altura || '--'} cm</strong></div>
                    <div className="small text-muted">W: <strong>{j.atributosAdicionales?.peso || '--'} kg</strong></div>
                  </div>
                </div>
              </Col>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default function EquiposPage({ selectedTorneoId }) {
  const queryClient = useQueryClient()
  const [selectedEquipoId, setSelectedEquipoId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(initialEquipoForm)

  const {
    data: equipos = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['equipos', selectedTorneoId],
    queryFn: () => apiGet(`/torneos/${selectedTorneoId}/equipos`),
    enabled: !!selectedTorneoId,
    onSuccess: (data) => {
      if (!selectedEquipoId && data.length > 0) {
        setSelectedEquipoId(data[0].id)
      }
    }
  })

  const mutation = useMutation({
    mutationFn: (newEquipo) => apiPost(`/torneos/${selectedTorneoId}/equipos`, newEquipo),
    onSuccess: () => {
      queryClient.invalidateQueries(['equipos', selectedTorneoId])
      queryClient.invalidateQueries(['tabla', selectedTorneoId])
      setForm(initialEquipoForm)
      setShowModal(false)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(form)
  }

  if (!selectedTorneoId) {
    return (
      <div className="text-center py-5">
        <People size={48} className="text-muted mb-3 opacity-25" />
        <h3 className="text-muted">Gestión de Equipos bloqueada</h3>
        <p className="text-muted">Selecciona un torneo para comenzar a inscribir delegaciones.</p>
      </div>
    )
  }

  const selectedEquipo = equipos.find(e => e.id === selectedEquipoId)

  return (
    <div className="container-fluid p-0 fade-in">
      <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
        <div>
          <h1 className="display-6 fw-bold mb-1">Equipos y Plantillas</h1>
          <p className="text-muted mb-0">Administra las delegaciones y su personal deportivo</p>
        </div>
        <Button
          variant="primary"
          className="d-flex align-items-center justify-content-center gap-2 px-4 shadow-sm"
          onClick={() => setShowModal(true)}
        >
          <Plus size={24} /> <span className="fw-bold">Inscribir Equipo</span>
        </Button>
      </header>

      {isError && <Alert variant="danger" className="border-0 shadow-sm mb-4">{error.message}</Alert>}

      <Row className="g-4">
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 py-3 px-4">
              <h5 className="mb-0 fw-bold">Delegaciones</h5>
            </Card.Header>
            <div className="px-2 pb-2">
              <ListGroup variant="flush" className="rounded-3 overflow-hidden">
                {equipos.length === 0 && !isLoading && (
                  <div className="text-center py-5 px-3">
                    <ShieldFill size={32} className="text-muted opacity-25 mb-2" />
                    <p className="small text-muted mb-0">No hay equipos registrados en este torneo aún.</p>
                  </div>
                )}
                {isLoading && (
                  <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
                )}
                {equipos.map((e) => (
                  <ListGroup.Item
                    key={e.id}
                    action
                    active={e.id === selectedEquipoId}
                    onClick={() => setSelectedEquipoId(e.id)}
                    className="border-0 py-3 px-4 mb-1 rounded-3 transition-all d-flex align-items-center gap-3"
                  >
                    <div className={`p-2 rounded-3 ${e.id === selectedEquipoId ? 'bg-white bg-opacity-20' : 'bg-light'}`}>
                      <ShieldFill size={20} className={e.id === selectedEquipoId ? 'text-white' : 'text-primary'} />
                    </div>
                    <div className="overflow-hidden">
                      <div className={`fw-bold text-truncate ${e.id === selectedEquipoId ? 'text-white' : ''}`}>{e.nombre}</div>
                      <small className={`d-flex align-items-center gap-1 text-truncate ${e.id === selectedEquipoId ? 'text-white text-opacity-75' : 'text-muted'}`}>
                        <Envelope size={10} /> {e.delegadoEmail}
                      </small>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Card>
        </Col>
        <Col lg={8}>
          {selectedEquipo ? (
            <JugadoresPanel torneoId={selectedTorneoId} equipo={selectedEquipo} />
          ) : (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center p-5 bg-white rounded-4 shadow-sm border border-dashed">
              <PersonBadgeFill size={48} className="text-muted opacity-25 mb-3" />
              <h5 className="text-muted fw-bold">Personal Administrativo</h5>
              <p className="text-muted text-center max-w-sm">Selecciona una delegación del listado para gestionar su plantilla de jugadores y cuerpo técnico.</p>
            </div>
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 px-4 pt-4">
          <Modal.Title className="fw-bold">Registro de Delegación</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted text-uppercase">Nombre de la Institución/Equipo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Deportivo Futuro"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="bg-light border-0 py-2 shadow-none"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-muted text-uppercase">Correo del Delegado</Form.Label>
              <Form.Control
                type="email"
                placeholder="contacto@equipo.com"
                value={form.delegadoEmail}
                onChange={(e) => setForm({ ...form, delegadoEmail: e.target.value })}
                className="bg-light border-0 py-2 shadow-none"
                required
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" className="py-2" disabled={mutation.isPending}>
                {mutation.isPending ? <Spinner size="sm" className="me-2" /> : <span className="fw-bold">Inscribir Oficialmente</span>}
              </Button>
              <Button variant="light" onClick={() => setShowModal(false)} className="py-2">
                Cancelar
              </Button>
            </div>
            {mutation.isError && <Alert variant="danger" className="mt-3 border-0 py-2 small">{mutation.error.message}</Alert>}
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}
