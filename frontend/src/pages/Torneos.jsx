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
  ButtonGroup,
  Badge,
} from 'react-bootstrap'
import { apiGet, apiPost, apiPut } from '../api'

const initialTorneoForm = {
  nombre: '',
  maxJugadoresPorEquipo: 15,
  puntosVictoria: 3,
  puntosEmpate: 1,
  puntosDerrota: 0,
}

function formatEstado(estado) {
  const S = estado.toLowerCase().replaceAll('_', ' ')
  return S.charAt(0).toUpperCase() + S.slice(1)
}

function TorneoCard({ torneo, selectedTorneoId, onSelectTorneo, onAction, isMutating }) {
  const queryClient = useQueryClient()
  const [showEdit, setShowEdit] = useState(false)
  const [editForm, setEditForm] = useState({ ...torneo })

  const updateMutation = useMutation({
    mutationFn: (updatedTorneo) => apiPut(`/torneos/${torneo.id}`, updatedTorneo),
    onSuccess: () => {
      queryClient.invalidateQueries(['torneos'])
      setShowEdit(false)
    },
  })

  const handleSave = (e) => {
    e.preventDefault()
    updateMutation.mutate(editForm)
  }

  const puedeAbrir = torneo.estado === 'CREADO' || torneo.estado === 'INSCRIPCIONES_CERRADAS'
  const puedeCerrar = torneo.estado === 'INSCRIPCIONES_ABIERTAS'
  const puedeSorteo = torneo.estado === 'INSCRIPCIONES_CERRADAS'
  const puedeFinalizar = torneo.estado === 'EN_JUEGO'

  return (
    <Card className={`mb-3 ${selectedTorneoId === torneo.id ? 'border-primary' : ''}`}>
      <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
        {torneo.nombre}
        <Badge bg={selectedTorneoId === torneo.id ? 'primary' : 'secondary'}>{formatEstado(torneo.estado)}</Badge>
      </Card.Header>
      <Card.Body>
        {showEdit ? (
          <Form onSubmit={handleSave}>
            {/* Form fields for editing... */}
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={editForm.nombre}
                onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
              />
            </Form.Group>
            {/* ... other fields ... */}
            <Button variant="primary" type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button variant="secondary" onClick={() => setShowEdit(false)} className="ms-2">
              Cancelar
            </Button>
            {updateMutation.isError && <Alert variant="danger" className="mt-2">{updateMutation.error.message}</Alert>}
          </Form>
        ) : (
          <>
            <Card.Text>
              Máx. jugadores por equipo: {torneo.maxJugadoresPorEquipo}
            </Card.Text>
            <ButtonGroup>
              <Button variant="outline-primary" onClick={() => onSelectTorneo(torneo.id)}>
                Seleccionar
              </Button>
              {torneo.estado === 'CREADO' && (
                <Button variant="outline-secondary" onClick={() => setShowEdit(true)}>
                  Editar
                </Button>
              )}
            </ButtonGroup>
            <hr />
            <div className="d-grid gap-2">
              <Button size="sm" variant="success" disabled={!puedeAbrir || isMutating} onClick={() => onAction(torneo.id, 'inscripciones/abrir', 'Inscripciones abiertas')}>
                {torneo.estado === 'INSCRIPCIONES_CERRADAS' ? 'Reabrir inscripciones' : 'Abrir inscripciones'}
              </Button>
              <Button size="sm" variant="warning" disabled={!puedeCerrar || isMutating} onClick={() => onAction(torneo.id, 'inscripciones/cerrar', 'Inscripciones cerradas')}>
                Cerrar inscripciones
              </Button>
              <Button size="sm" variant="info" disabled={!puedeSorteo || isMutating} onClick={() => onAction(torneo.id, 'sorteo', 'Sorteo generado')}>
                Generar sorteo
              </Button>
              <Button size="sm" variant="danger" disabled={!puedeFinalizar || isMutating} onClick={() => onAction(torneo.id, 'finalizar', 'Torneo finalizado')}>
                Finalizar torneo
              </Button>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  )
}

export default function TorneosPage({ selectedTorneoId, onSelectTorneo }) {
  const queryClient = useQueryClient()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [form, setForm] = useState(initialTorneoForm)

  const { data: torneos = [], isLoading, isError, error } = useQuery({
    queryKey: ['torneos'],
    queryFn: () => apiGet('/torneos'),
  })

  const createMutation = useMutation({
    mutationFn: (newTorneo) => apiPost('/torneos', newTorneo),
    onSuccess: (newTorneo) => {
      queryClient.invalidateQueries(['torneos'])
      setShowCreateModal(false)
      setForm(initialTorneoForm)
      onSelectTorneo(newTorneo.id) // Select the new tournament
    },
  })
  
  const actionMutation = useMutation({
    mutationFn: ({ torneoId, path }) => apiPost(`/torneos/${torneoId}/${path}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['torneos'])
    },
  })

  const handleCreate = (e) => {
    e.preventDefault()
    createMutation.mutate(form)
  }

  const handleAction = (torneoId, path, label) => {
    actionMutation.mutate({ torneoId, path })
  }

  if (isLoading) {
    return <Spinner animation="border" />
  }

  if (isError) {
    return <Alert variant="danger">Error al cargar torneos: {error.message}</Alert>
  }

  return (
    <Container fluid>
      <Row className="mb-3 align-items-center">
        <Col>
          <h1>Gestión de Torneos</h1>
        </Col>
        <Col className="text-end">
          <Button onClick={() => setShowCreateModal(true)}>Crear Torneo</Button>
        </Col>
      </Row>

      {actionMutation.isError && <Alert variant="danger">Acción fallida: {actionMutation.error.message}</Alert>}

      <Row>
        {torneos.map((t) => (
          <Col md={6} lg={4} key={t.id}>
            <TorneoCard 
              torneo={t} 
              selectedTorneoId={selectedTorneoId} 
              onSelectTorneo={onSelectTorneo}
              onAction={handleAction}
              isMutating={actionMutation.isPending}
            />
          </Col>
        ))}
      </Row>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Torneo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreate}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del torneo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Torneo Apertura"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Máx. jugadores por equipo</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={form.maxJugadoresPorEquipo}
                onChange={(e) => setForm({ ...form, maxJugadoresPorEquipo: Number(e.target.value) })}
              />
            </Form.Group>
            <p>Puntuación</p>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Victoria</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={form.puntosVictoria}
                    onChange={(e) => setForm({ ...form, puntosVictoria: Number(e.target.value) })}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Empate</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={form.puntosEmpate}
                    onChange={(e) => setForm({ ...form, puntosEmpate: Number(e.target.value) })}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Derrota</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={form.puntosDerrota}
                    onChange={(e) => setForm({ ...form, puntosDerrota: Number(e.target.value) })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creando...' : 'Crear Torneo'}
            </Button>
            {createMutation.isError && <Alert variant="danger" className="mt-2">{createMutation.error.message}</Alert>}
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  )
}