import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Alert,
  Modal,
  Form,
  ListGroup,
  Badge,
} from 'react-bootstrap'
import { apiGet, apiPost } from '../api'

const initialEquipoForm = { nombre: '', delegadoEmail: '' }
const initialJugadorForm = { nombre: '', numeroCamiseta: 10 }

function JugadoresPanel({ torneoId, equipo }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState(initialJugadorForm)

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

  const mutation = useMutation({
    mutationFn: (newJugador) => apiPost(`/torneos/${torneoId}/equipos/${equipo.id}/jugadores`, newJugador),
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
    <Card>
      <Card.Header>
        <Card.Title as="h4">Jugadores de {equipo.nombre}</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit} className="mb-4">
          <h5>Agregar Jugador</h5>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre del jugador"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Camiseta</Form.Label>
                <Form.Control
                  type="number"
                  value={form.numeroCamiseta}
                  onChange={(e) => setForm({ ...form, numeroCamiseta: Number(e.target.value) })}
                />
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <Spinner as="span" size="sm" /> : 'Agregar'}
              </Button>
            </Col>
          </Row>
          {mutation.isError && <Alert variant="danger" className="mt-2">{mutation.error.message}</Alert>}
        </Form>
        
        <h5>Lista de Jugadores</h5>
        {isLoading ? <Spinner animation="border" /> : null}
        {isError ? <Alert variant="danger">{error.message}</Alert> : null}
        <ListGroup>
          {jugadores.length === 0 && <ListGroup.Item>No hay jugadores inscritos.</ListGroup.Item>}
          {jugadores.map((j) => (
            <ListGroup.Item key={j.id} className="d-flex justify-content-between align-items-center">
              {j.nombre}
              <Badge bg="secondary">#{j.numeroCamiseta}</Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
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
    return <Alert variant="info">Por favor, selecciona un torneo para gestionar los equipos.</Alert>
  }
  
  const selectedEquipo = equipos.find(e => e.id === selectedEquipoId)

  return (
    <Container fluid>
      <Row className="mb-3 align-items-center">
        <Col>
          <h1>Gestión de Equipos</h1>
          <p className="text-muted">Inscribe equipos y agrega jugadores.</p>
        </Col>
        <Col className="text-end">
          <Button onClick={() => setShowModal(true)}>Inscribir Equipo</Button>
        </Col>
      </Row>
      
      {isLoading ? <Spinner animation="border" /> : null}
      {isError ? <Alert variant="danger">{error.message}</Alert> : null}
      
      <Row>
        <Col md={4}>
          <Card>
            <Card.Header>
              <Card.Title as="h4">Equipos Inscritos</Card.Title>
            </Card.Header>
            <ListGroup variant="flush">
              {equipos.length === 0 && <ListGroup.Item>No hay equipos inscritos.</ListGroup.Item>}
              {equipos.map((e) => (
                <ListGroup.Item
                  key={e.id}
                  action
                  active={e.id === selectedEquipoId}
                  onClick={() => setSelectedEquipoId(e.id)}
                >
                  <div className="fw-bold">{e.nombre}</div>
                  <small className="text-muted">{e.delegadoEmail}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
        <Col md={8}>
          {selectedEquipo ? (
            <JugadoresPanel torneoId={selectedTorneoId} equipo={selectedEquipo} />
          ) : (
            <Alert variant="secondary">Selecciona un equipo para ver sus jugadores.</Alert>
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Inscribir Nuevo Equipo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del equipo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Leones FC"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email del delegado</Form.Label>
              <Form.Control
                type="email"
                placeholder="delegado@email.com"
                value={form.delegadoEmail}
                onChange={(e) => setForm({ ...form, delegadoEmail: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Inscribiendo...' : 'Inscribir Equipo'}
            </Button>
            {mutation.isError && <Alert variant="danger" className="mt-2">{mutation.error.message}</Alert>}
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  )
}
