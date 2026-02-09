import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert, Spinner, Card, Row, Col, Form, Button, Table, Badge, Modal } from 'react-bootstrap'
import { Calendar2Event, Trophy, Clock, Filter, CheckCircleFill, DashCircleFill, PlusCircle } from 'react-bootstrap-icons'
import { apiGet, apiPut, apiPost } from '../api'

const initialProgramarForm = { partidoId: '', fechaProgramada: '' }
const initialResultadoForm = { partidoId: '', golesLocal: 0, golesVisitante: 0 }
const initialEventoForm = { jugadorId: '', tipo: 'GOL', minuto: 0, descripcion: '' }

export default function PartidosPage({ selectedTorneoId }) {
  const queryClient = useQueryClient()
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const [jornadaFiltro, setJornadaFiltro] = useState('')
  const [programarForm, setProgramarForm] = useState(initialProgramarForm)
  const [resultadoForm, setResultadoForm] = useState(initialResultadoForm)
  const [showEventoModal, setShowEventoModal] = useState(false)
  const [selectedPartido, setSelectedPartido] = useState(null)
  const [eventoForm, setEventoForm] = useState(initialEventoForm)

  const {
    data: partidos = [],
    isLoading: loadingPartidos,
    isError: isErrorPartidos,
    error: errorPartidos,
  } = useQuery({
    queryKey: ['partidos', selectedTorneoId],
    queryFn: () => apiGet(`/partidos/torneo/${selectedTorneoId}`),
    enabled: !!selectedTorneoId,
  })

  const {
    data: equipos = [],
  } = useQuery({
    queryKey: ['equipos', selectedTorneoId],
    queryFn: () => apiGet(`/torneos/${selectedTorneoId}/equipos`),
    enabled: !!selectedTorneoId,
  })

  const equiposById = useMemo(() => {
    return new Map(equipos.map((e) => [e.id, e.nombre]))
  }, [equipos])

  const partidosFiltrados = useMemo(() => {
    return partidos.filter((p) => {
      const matchEstado = estadoFiltro ? p.resultado === estadoFiltro : true
      const matchJornada = jornadaFiltro ? String(p.jornada) === String(jornadaFiltro) : true
      return matchEstado && matchJornada
    })
  }, [partidos, estadoFiltro, jornadaFiltro])

  const programarMutation = useMutation({
    mutationFn: ({ partidoId, fechaProgramada }) =>
      apiPut(`/partidos/${partidoId}/programar`, { fechaProgramada }),
    onSuccess: () => {
      queryClient.invalidateQueries(['partidos', selectedTorneoId])
      setProgramarForm(initialProgramarForm)
    },
  })

  const resultadoMutation = useMutation({
    mutationFn: ({ partidoId, golesLocal, golesVisitante }) =>
      apiPut(`/partidos/${partidoId}/resultado`, { golesLocal, golesVisitante }),
    onSuccess: () => {
      queryClient.invalidateQueries(['partidos', selectedTorneoId])
      queryClient.invalidateQueries(['tabla', selectedTorneoId])
      setResultadoForm(initialResultadoForm)
    },
  })

  const eventoMutation = useMutation({
    mutationFn: ({ partidoId, ...evento }) =>
      apiPost(`/partidos/${partidoId}/eventos`, evento),
    onSuccess: () => {
      queryClient.invalidateQueries(['goleadores', selectedTorneoId])
      queryClient.invalidateQueries(['fairplay', selectedTorneoId])
      setShowEventoModal(false)
      setEventoForm(initialEventoForm)
    },
  })

  const openEventoModal = (partido) => {
    setSelectedPartido(partido)
    setShowEventoModal(true)
  }

  const handleEventoSubmit = (e) => {
    e.preventDefault()
    if (!selectedPartido || !eventoForm.jugadorId) return
    eventoMutation.mutate({ partidoId: selectedPartido.id, ...eventoForm })
  }

  const handleProgramar = (e) => {
    e.preventDefault()
    if (!programarForm.partidoId || !programarForm.fechaProgramada) return
    programarMutation.mutate(programarForm)
  }

  const handleResultado = (e) => {
    e.preventDefault()
    if (!resultadoForm.partidoId) return
    resultadoMutation.mutate(resultadoForm)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDIENTE': return <Badge bg="light" text="dark" className="border shadow-none">Pendiente</Badge>
      case 'LOCAL_GANO': return <Badge bg="primary-light" className="text-primary-accent border-0">Galt. Local</Badge>
      case 'VISITANTE_GANO': return <Badge bg="primary-light" className="text-primary-accent border-0">Galt. Vis.</Badge>
      case 'EMPATE': return <Badge bg="warning-light" className="text-warning border-0">Empate</Badge>
      default: return <Badge bg="secondary">Finalizado</Badge>
    }
  }

  if (!selectedTorneoId) {
    return (
      <div className="text-center py-5">
        <Calendar2Event size={48} className="text-muted mb-3 opacity-25" />
        <h3 className="text-muted">Calendario no disponible</h3>
        <p className="text-muted">Selecciona un torneo para gestionar su cronograma de encuentros.</p>
      </div>
    )
  }

  return (
    <div className="container-fluid p-0 fade-in">
      <header className="mb-5">
        <h1 className="display-6 fw-bold mb-1">Centro de Competición</h1>
        <p className="text-muted">Programación de encuentros y registro oficial de resultados</p>
      </header>

      {/* Control Panel */}
      <Card className="border-0 shadow-sm mb-5">
        <Card.Header className="bg-white border-0 py-3 px-4">
          <h5 className="mb-0 fw-bold">Gestión de Encuentros</h5>
        </Card.Header>
        <Card.Body className="px-4 pb-4">
          <Row className="g-4">
            <Col lg={6}>
              <div className="p-4 rounded-4 bg-light h-100">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <Clock className="text-primary" /> Programar Fecha y Hora
                </h6>
                <Form onSubmit={handleProgramar}>
                  <Form.Group className="mb-3">
                    <Form.Select
                      value={programarForm.partidoId}
                      onChange={(e) => setProgramarForm({ ...programarForm, partidoId: e.target.value })}
                      className="border-0 shadow-none py-2"
                    >
                      <option value="">Seleccionar encuentro...</option>
                      {partidos.filter(p => !p.fechaProgramada).map((p) => (
                        <option key={p.id} value={p.id}>
                          J{p.jornada}: {equiposById.get(p.equipoLocalId) || 'Eq 1'} vs {equiposById.get(p.equipoVisitanteId) || 'Eq 2'}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="datetime-local"
                      value={programarForm.fechaProgramada}
                      onChange={(e) => setProgramarForm({ ...programarForm, fechaProgramada: e.target.value })}
                      className="border-0 shadow-none py-2"
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100 fw-bold py-2 shadow-sm" disabled={programarMutation.isPending}>
                    {programarMutation.isPending ? <Spinner size="sm" /> : 'Confirmar Programación'}
                  </Button>
                </Form>
              </div>
            </Col>

            <Col lg={6}>
              <div className="p-4 rounded-4 bg-primary bg-opacity-10 h-100">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <Trophy className="text-primary" /> Registrar Acta de Partido
                </h6>
                <Form onSubmit={handleResultado}>
                  <Form.Group className="mb-3">
                    <Form.Select
                      value={resultadoForm.partidoId}
                      onChange={(e) => setResultadoForm({ ...resultadoForm, partidoId: e.target.value })}
                      className="border-0 shadow-none py-2"
                    >
                      <option value="">Seleccionar encuentro...</option>
                      {partidos.filter(p => p.resultado === 'PENDIENTE').map((p) => (
                        <option key={p.id} value={p.id}>
                          J{p.jornada}: {equiposById.get(p.equipoLocalId) || 'Eq 1'} vs {equiposById.get(p.equipoVisitanteId) || 'Eq 2'}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Row className="g-3 mb-3">
                    <Col>
                      <Form.Control
                        type="number"
                        min="0"
                        value={resultadoForm.golesLocal}
                        onChange={(e) => setResultadoForm({ ...resultadoForm, golesLocal: Number(e.target.value) })}
                        placeholder="Local"
                        className="border-0 shadow-none py-2 text-center fw-bold"
                      />
                    </Col>
                    <Col xs="auto" className="d-flex align-items-center text-muted fw-bold">-</Col>
                    <Col>
                      <Form.Control
                        type="number"
                        min="0"
                        value={resultadoForm.golesVisitante}
                        onChange={(e) => setResultadoForm({ ...resultadoForm, golesVisitante: Number(e.target.value) })}
                        placeholder="Vis."
                        className="border-0 shadow-none py-2 text-center fw-bold"
                      />
                    </Col>
                  </Row>
                  <Button variant="dark" type="submit" className="w-100 fw-bold py-2" disabled={resultadoMutation.isPending}>
                    {resultadoMutation.isPending ? <Spinner size="sm" /> : 'Sellar Resultado'}
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Filters & Listing */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <Card.Header className="bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
          <h5 className="mb-0 fw-bold">Calendario de Encuentros</h5>
          <div className="d-flex gap-2">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-0"><Filter size={14} /></span>
              <Form.Control
                type="number"
                min="1"
                placeholder="Jornada"
                value={jornadaFiltro}
                onChange={(e) => setJornadaFiltro(e.target.value)}
                className="bg-light border-0 shadow-none"
                style={{ width: '80px' }}
              />
            </div>
            <Form.Select
              size="sm"
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="bg-light border-0 shadow-none"
              style={{ width: '130px' }}
            >
              <option value="">Estados</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="LOCAL_GANO">G. Local</option>
              <option value="VISITANTE_GANO">G. Visitante</option>
              <option value="EMPATE">Empates</option>
            </Form.Select>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {(loadingPartidos) && (
            <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
          )}

          <Table responsive hover className="align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-4 small text-muted text-uppercase">Jor.</th>
                <th className="small text-muted text-uppercase">Encuentro</th>
                <th className="small text-muted text-uppercase text-center">Score</th>
                <th className="small text-muted text-uppercase">Programación</th>
                <th className="pe-4 small text-muted text-uppercase text-end">Estado</th>
              </tr>
            </thead>
            <tbody>
              {partidosFiltrados.map((p) => (
                <tr key={p.id}>
                  <td className="ps-4">
                    <Badge bg="secondary" className="bg-opacity-10 text-secondary border">J{p.jornada}</Badge>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-semibold">{equiposById.get(p.equipoLocalId) || 'Eq 1'}</span>
                      <small className="text-muted fw-bold">VS</small>
                      <span className="fw-semibold">{equiposById.get(p.equipoVisitanteId) || 'Eq 2'}</span>
                    </div>
                  </td>
                  <td className="text-center">
                    {p.resultado !== 'PENDIENTE' ? (
                      <div className="fw-bold h5 mb-0">
                        {p.golesLocal} <span className="text-muted small">-</span> {p.golesVisitante}
                      </div>
                    ) : (
                      <DashCircleFill className="text-muted opacity-25" />
                    )}
                  </td>
                  <td className="small">
                    {p.fechaProgramada ? (
                      <div className="d-flex align-items-center gap-2">
                        <CheckCircleFill size={12} className="text-success" />
                        <div>
                          <div className="fw-bold">{new Date(p.fechaProgramada).toLocaleDateString()}</div>
                          <div className="text-muted">{new Date(p.fechaProgramada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted italic">No programado</span>
                    )}
                  </td>
                  <td className="pe-4 text-end">
                    <div className="d-flex justify-content-end align-items-center gap-2">
                      {p.resultado !== 'PENDIENTE' && (
                        <Button variant="outline-primary" size="sm" onClick={() => openEventoModal(p)} title="Añadir Evento">
                          <PlusCircle size={14} />
                        </Button>
                      )}
                      {getStatusBadge(p.resultado)}
                    </div>
                  </td>
                </tr>
              ))}
              {partidosFiltrados.length === 0 && !loadingPartidos && (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <Calendar2Event size={32} className="opacity-25 mb-2" />
                    <p className="mb-0">No se encontraron encuentros con los filtros aplicados.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showEventoModal} onHide={() => setShowEventoModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Registrar Evento de Partido</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEventoSubmit}>
          <Modal.Body className="pt-3">
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">Tipo de Evento</Form.Label>
              <Form.Select
                value={eventoForm.tipo}
                onChange={(e) => setEventoForm({ ...eventoForm, tipo: e.target.value })}
                className="border-0 bg-light shadow-none"
              >
                <option value="GOL">Gol</option>
                <option value="ASISTENCIA">Asistencia</option>
                <option value="TARJETA_AMARILLA">Tarjeta Amarilla</option>
                <option value="TARJETA_ROJA">Tarjeta Roja</option>
                <option value="AUTOGOL">Autogol</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">Minuto</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="120"
                value={eventoForm.minuto}
                onChange={(e) => setEventoForm({ ...eventoForm, minuto: Number(e.target.value) })}
                className="border-0 bg-light shadow-none"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">Jugador (ID)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introducir UUID del jugador..."
                value={eventoForm.jugadorId}
                onChange={(e) => setEventoForm({ ...eventoForm, jugadorId: e.target.value })}
                className="border-0 bg-light shadow-none"
              />
              <Form.Text className="text-muted">En una versión final, aquí habría un buscador de jugadores.</Form.Text>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="small fw-bold text-muted">Descripción (Opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={eventoForm.descripcion}
                onChange={(e) => setEventoForm({ ...eventoForm, descripcion: e.target.value })}
                className="border-0 bg-light shadow-none"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="light" onClick={() => setShowEventoModal(false)} className="fw-bold px-4">Cancelar</Button>
            <Button variant="primary" type="submit" className="fw-bold px-4 shadow-sm" disabled={eventoMutation.isPending}>
              {eventoMutation.isPending ? <Spinner size="sm" /> : 'Registrar Evento'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}
