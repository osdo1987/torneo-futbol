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
  Badge,
} from 'react-bootstrap'
import { Trophy, Plus, Gear, CheckCircle, XCircle, PlayFill, LockFill, Folder2, ArrowRight } from 'react-bootstrap-icons'
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

function getEstadoVariant(estado) {
  switch (estado) {
    case 'CREADO': return 'secondary'
    case 'INSCRIPCIONES_ABIERTAS': return 'success'
    case 'INSCRIPCIONES_CERRADAS': return 'warning'
    case 'EN_JUEGO': return 'primary'
    case 'FINALIZADO': return 'danger'
    default: return 'info'
  }
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

  const isSelected = selectedTorneoId === torneo.id
  const puedeAbrir = torneo.estado === 'CREADO' || torneo.estado === 'INSCRIPCIONES_CERRADAS'
  const puedeCerrar = torneo.estado === 'INSCRIPCIONES_ABIERTAS'
  const puedeSorteo = torneo.estado === 'INSCRIPCIONES_CERRADAS'
  const puedeFinalizar = torneo.estado === 'EN_JUEGO'

  const [showFases, setShowFases] = useState(false)
  const [showAdvance, setShowAdvance] = useState(false)
  const [advanceForm, setAdvanceForm] = useState({ nombreNuevaFase: '' })

  const { data: fases = [], refetch: refetchFases } = useQuery({
    queryKey: ['fases', torneo.id],
    queryFn: () => apiGet(`/fases/torneo/${torneo.id}`),
    enabled: showFases || showAdvance
  })

  const advanceMutation = useMutation({
    mutationFn: (data) => apiPost(`/fases/torneo/${torneo.id}/avanzar?faseActualId=${data.faseActualId}&nombreNuevaFase=${data.nombreNuevaFase}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['torneos'])
      refetchFases()
      setShowAdvance(false)
    },
  })

  const handleAdvance = (e) => {
    e.preventDefault()
    const ultimaFase = fases.sort((a, b) => b.orden - a.orden)[0]
    if (!ultimaFase) return
    advanceMutation.mutate({
      faseActualId: ultimaFase.id,
      nombreNuevaFase: advanceForm.nombreNuevaFase
    })
  }

  return (
    <Card className={`h-100 border-0 shadow-sm ${isSelected ? 'ring-2 ring-primary' : ''}`} style={{ transition: 'all 0.3s' }}>
      <Card.Header className="bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <div className={`p-2 rounded bg-${getEstadoVariant(torneo.estado)} bg-opacity-10 text-${getEstadoVariant(torneo.estado)}`}>
            <Trophy size={16} />
          </div>
          <h5 className="mb-0 fw-bold">{torneo.nombre}</h5>
        </div>
        <Badge pill bg={getEstadoVariant(torneo.estado)} className="px-3 py-2 fw-semibold">
          {formatEstado(torneo.estado)}
        </Badge>
      </Card.Header>

      <Card.Body className="px-4 pb-4">
        {showEdit ? (
          <Form onSubmit={handleSave} className="fade-in">
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">Nombre del Torneo</Form.Label>
              <Form.Control
                type="text"
                value={editForm.nombre}
                onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                className="bg-light border-0 shadow-none"
              />
            </Form.Group>
            <div className="d-flex gap-2 mt-4">
              <Button variant="primary" size="sm" type="submit" className="flex-grow-1" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              <Button variant="light" size="sm" onClick={() => setShowEdit(false)}>
                Cancelar
              </Button>
            </div>
          </Form>
        ) : (
          <div className="fade-in">
            <div className="row g-3 mb-4">
              <div className="col-6">
                <div className="p-2 border rounded bg-light">
                  <small className="text-muted d-block fw-bold" style={{ fontSize: '0.65rem' }}>Máx. Jugadores</small>
                  <span className="fw-semibold">{torneo.maxJugadoresPorEquipo}</span>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 border rounded bg-light">
                  <small className="text-muted d-block fw-bold" style={{ fontSize: '0.65rem' }}>Puntos x Victoria</small>
                  <span className="fw-semibold">{torneo.puntosVictoria}</span>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 mb-3">
              <Button
                variant={isSelected ? "primary" : "outline-primary"}
                className="flex-grow-1 fw-bold"
                onClick={() => onSelectTorneo(torneo.id)}
              >
                {isSelected ? 'Seleccionado' : 'Seleccionar'}
              </Button>
              {torneo.estado === 'CREADO' && (
                <Button variant="light" onClick={() => setShowEdit(true)}>
                  <Gear />
                </Button>
              )}
            </div>

            <div className="bg-light p-3 rounded-3 mt-4">
              <small className="text-muted text-uppercase fw-bold mb-3 d-block" style={{ fontSize: '0.65rem' }}>Acciones de Gestión</small>
              <div className="d-flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="success"
                  className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                  disabled={!puedeAbrir || isMutating}
                  onClick={() => onAction(torneo.id, 'inscripciones/abrir')}
                >
                  <CheckCircle size={14} /> Abrir
                </Button>
                <Button
                  size="sm"
                  variant="warning"
                  className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                  disabled={!puedeCerrar || isMutating}
                  onClick={() => onAction(torneo.id, 'inscripciones/cerrar')}
                >
                  <LockFill size={14} /> Cerrar
                </Button>
                <Button
                  size="sm"
                  variant="info"
                  className="text-white flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                  disabled={!puedeSorteo || isMutating}
                  onClick={() => onAction(torneo.id, 'sorteo')}
                >
                  <PlayFill size={14} /> Sorteo
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                  disabled={!puedeFinalizar || isMutating}
                  onClick={() => onAction(torneo.id, 'finalizar')}
                >
                  <XCircle size={14} /> Finalizar
                </Button>
              </div>

              {torneo.estado === 'EN_JUEGO' && (
                <div className="d-flex gap-2 mt-3 pt-3 border-top">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="flex-grow-1 fw-bold d-flex align-items-center justify-content-center gap-2"
                    onClick={() => setShowFases(true)}
                  >
                    <Folder2 size={14} /> Fases
                  </Button>
                  <Button
                    variant="dark"
                    size="sm"
                    className="flex-grow-1 fw-bold d-flex align-items-center justify-content-center gap-2"
                    onClick={() => setShowAdvance(true)}
                  >
                    Avanzar <ArrowRight size={14} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Card.Body>

      {/* Modal Lista de Fases */}
      <Modal show={showFases} onHide={() => setShowFases(false)} size="sm" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold h6">Cronograma de Fases</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fases.sort((a, b) => b.orden - a.orden).map(f => (
            <div key={f.id} className="d-flex align-items-center justify-content-between mb-3 p-2 bg-light rounded shadow-xs">
              <div>
                <div className="fw-bold small">{f.nombre}</div>
                <div className="text-muted" style={{ fontSize: '0.6rem' }}>{f.tipo}</div>
              </div>
              {f.completada ? <CheckCircle className="text-success" /> : <div className="spinner-grow spinner-grow-sm text-primary" />}
            </div>
          ))}
          {fases.length === 0 && <p className="text-center text-muted small py-3">No hay fases generadas.</p>}
        </Modal.Body>
      </Modal>

      {/* Modal Avanzar Fase */}
      <Modal show={showAdvance} onHide={() => setShowAdvance(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Promoción de Fase</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAdvance}>
          <Modal.Body className="pt-0">
            <p className="text-muted small mb-4">
              Esta acción tomará los mejores equipos de la fase actual y generará los nuevos encuentros automáticamente.
            </p>
            <Form.Group>
              <Form.Label className="small fw-bold text-muted text-uppercase">Nombre de la Nueva Fase</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Cuartos de Final"
                value={advanceForm.nombreNuevaFase}
                onChange={(e) => setAdvanceForm({ nombreNuevaFase: e.target.value })}
                className="bg-light border-0 shadow-none py-2"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="light" onClick={() => setShowAdvance(false)}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={advanceMutation.isPending}>
              {advanceMutation.isPending ? <Spinner size="sm" /> : 'Confirmar Avance'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
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
      onSelectTorneo(newTorneo.id)
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

  const handleAction = (torneoId, path) => {
    actionMutation.mutate({ torneoId, path })
  }

  if (isLoading) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
    </div>
  )

  return (
    <div className="container-fluid p-0 fade-in">
      <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
        <div>
          <h1 className="display-6 fw-bold mb-1">Gestión de Torneos</h1>
          <p className="text-muted mb-0">Crea, edita y gestiona el ciclo de vida de tus competiciones</p>
        </div>
        <Button
          variant="primary"
          className="d-flex align-items-center justify-content-center gap-2 px-4 shadow-sm"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={24} /> <span className="fw-bold">Nuevo Torneo</span>
        </Button>
      </header>

      {actionMutation.isError && (
        <Alert variant="danger" className="border-0 shadow-sm mb-4">
          <div className="d-flex align-items-center gap-2">
            <XCircle />
            <span>Error en la acción: {actionMutation.error.message}</span>
          </div>
        </Alert>
      )}

      <Row className="g-4">
        {torneos.map((t) => (
          <Col xl={4} lg={6} key={t.id}>
            <TorneoCard
              torneo={t}
              selectedTorneoId={selectedTorneoId}
              onSelectTorneo={onSelectTorneo}
              onAction={handleAction}
              isMutating={actionMutation.isPending}
            />
          </Col>
        ))}
        {torneos.length === 0 && (
          <Col xs={12}>
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
              <Trophy size={64} className="text-muted opacity-25 mb-3" />
              <h3>No hay torneos registrados</h3>
              <p className="text-muted">Comienza creando tu primer torneo profesional.</p>
              <Button onClick={() => setShowCreateModal(true)} variant="outline-primary" className="mt-2">Crear mi primer torneo</Button>
            </div>
          </Col>
        )}
      </Row>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0 px-4 pt-4">
          <Modal.Title className="fw-bold">Configurar Nuevo Torneo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4 pt-3">
          <Form onSubmit={handleCreate}>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-muted">Nombre Comercial</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Copa Master 2026"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="bg-light border-0 py-2 shadow-none"
                required
              />
            </Form.Group>

            <div className="bg-light p-3 rounded-3 mb-4">
              <h6 className="fw-bold mb-3 small text-uppercase text-muted">Reglas del Torneo</h6>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Máx. jugadores por equipo</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={form.maxJugadoresPorEquipo}
                  onChange={(e) => setForm({ ...form, maxJugadoresPorEquipo: Number(e.target.value) })}
                  className="border-0 py-2 shadow-none"
                />
              </Form.Group>

              <Row className="g-3">
                <Col>
                  <Form.Group>
                    <Form.Label className="small fw-bold">Victoria</Form.Label>
                    <Form.Control
                      type="number"
                      value={form.puntosVictoria}
                      onChange={(e) => setForm({ ...form, puntosVictoria: Number(e.target.value) })}
                      className="border-0 shadow-none text-center"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label className="small fw-bold">Empate</Form.Label>
                    <Form.Control
                      type="number"
                      value={form.puntosEmpate}
                      onChange={(e) => setForm({ ...form, puntosEmpate: Number(e.target.value) })}
                      className="border-0 shadow-none text-center"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label className="small fw-bold">Derrota</Form.Label>
                    <Form.Control
                      type="number"
                      value={form.puntosDerrota}
                      onChange={(e) => setForm({ ...form, puntosDerrota: Number(e.target.value) })}
                      className="border-0 shadow-none text-center"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" className="py-2" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <><Spinner size="sm" className="me-2" /> Creando...</>
                ) : (
                  <span className="fw-bold">Inicializar Torneo</span>
                )}
              </Button>
              <Button variant="light" onClick={() => setShowCreateModal(false)} className="py-2">
                Cancelar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}