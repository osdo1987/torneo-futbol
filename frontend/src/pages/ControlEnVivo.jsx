import { useState, useMemo } from 'react'
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
    Table,
} from 'react-bootstrap'
import { Trophy, Clock, Balloon, Calendar2Event, ShieldFill } from 'react-bootstrap-icons'
import { apiGet, apiPost, apiPut } from '../api'

const initialEventoForm = { jugadorId: '', tipo: 'GOL', minuto: 1, descripcion: '' }

export default function ControlEnVivoPage({ selectedTorneoId }) {
    const queryClient = useQueryClient()
    const [selectedEquipoId, setSelectedEquipoId] = useState(null)
    const [selectedPartido, setSelectedPartido] = useState(null)
    const [showEventoModal, setShowEventoModal] = useState(false)
    const [eventoForm, setEventoForm] = useState(initialEventoForm)

    const { data: equipos = [], isLoading: loadingEquipos } = useQuery({
        queryKey: ['equipos', selectedTorneoId],
        queryFn: () => apiGet(`/torneos/${selectedTorneoId}/equipos`),
        enabled: !!selectedTorneoId,
    })

    const { data: matches = [], isLoading: loadingMatches } = useQuery({
        queryKey: ['partidos-equipo', selectedTorneoId, selectedEquipoId],
        queryFn: () => apiGet(`/partidos/torneo/${selectedTorneoId}`),
        enabled: !!selectedTorneoId && !!selectedEquipoId,
        select: (data) => data.filter(p => p.equipoLocalId === selectedEquipoId || p.equipoVisitanteId === selectedEquipoId)
    })

    const { data: jugadoresPartido = [] } = useQuery({
        queryKey: ['jugadores-partido', selectedPartido?.id],
        queryFn: async () => {
            const local = await apiGet(`/torneos/${selectedTorneoId}/equipos/${selectedPartido.equipoLocalId}/jugadores`);
            const visitante = await apiGet(`/torneos/${selectedTorneoId}/equipos/${selectedPartido.equipoVisitanteId}/jugadores`);
            return [
                ...local.map(j => ({ ...j, equipo: 'Local' })),
                ...visitante.map(j => ({ ...j, equipo: 'Visitante' }))
            ];
        },
        enabled: !!selectedPartido && !!selectedTorneoId,
    })

    const equiposById = useMemo(() => new Map(equipos.map(e => [e.id, e.nombre])), [equipos])

    const marcadorRealTimeMutation = useMutation({
        mutationFn: ({ partidoId, golesLocal, golesVisitante }) =>
            apiPut(`/partidos/${partidoId}/marcador-realtime`, { golesLocal, golesVisitante }),
        onSuccess: () => queryClient.invalidateQueries(['partidos-equipo', selectedTorneoId, selectedEquipoId]),
    })

    const eventoMutation = useMutation({
        mutationFn: ({ partidoId, ...evento }) => apiPost(`/partidos/${partidoId}/eventos`, evento),
        onSuccess: () => {
            setShowEventoModal(false)
            setEventoForm(initialEventoForm)
            queryClient.invalidateQueries(['partido-eventos'])
            queryClient.invalidateQueries(['partidos-equipo'])
        },
    })

    const handleRealTimeUpdate = (partidoId, gl, gv) => {
        marcadorRealTimeMutation.mutate({ partidoId, golesLocal: gl, golesVisitante: gv })
    }

    const handleEventoSubmit = (e) => {
        e.preventDefault()
        if (!selectedPartido || !eventoForm.jugadorId) return
        eventoMutation.mutate({ partidoId: selectedPartido.id, ...eventoForm })
    }

    const selectedEquipo = equipos.find(e => e.id === selectedEquipoId)

    if (!selectedTorneoId) {
        return (
            <div className="text-center py-5">
                <Calendar2Event size={48} className="text-muted mb-3 opacity-25" />
                <h3 className="text-muted">Control en Vivo no disponible</h3>
                <p className="text-muted">Selecciona un torneo para gestionar partidos en tiempo real.</p>
            </div>
        )
    }

    return (
        <div className="container-fluid p-0 fade-in">
            <header className="mb-5">
                <h1 className="display-6 fw-bold mb-1">Control de Partidos en Vivo</h1>
                <p className="text-muted">Gestiona marcadores y eventos en tiempo real por equipo</p>
            </header>

            <Row className="g-4">
                {/* Selector de Equipos */}
                <Col lg={3}>
                    <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
                        <Card.Header className="bg-white border-0 py-3 px-4">
                            <h5 className="mb-0 fw-bold">Seleccionar Equipo</h5>
                        </Card.Header>
                        <Card.Body className="p-2">
                            {loadingEquipos ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" size="sm" />
                                </div>
                            ) : (
                                <div className="d-grid gap-2">
                                    {equipos.map(equipo => (
                                        <Button
                                            key={equipo.id}
                                            variant={selectedEquipoId === equipo.id ? 'primary' : 'light'}
                                            className="text-start d-flex align-items-center gap-2 py-3"
                                            onClick={() => setSelectedEquipoId(equipo.id)}
                                        >
                                            <ShieldFill size={18} />
                                            <span className="fw-semibold">{equipo.nombre}</span>
                                        </Button>
                                    ))}
                                    {equipos.length === 0 && (
                                        <div className="text-center py-4 text-muted small">
                                            No hay equipos inscritos
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Panel de Partidos */}
                <Col lg={9}>
                    {!selectedEquipoId ? (
                        <div className="h-100 d-flex flex-column align-items-center justify-content-center p-5 bg-white rounded-4 shadow-sm border border-dashed">
                            <Trophy size={48} className="text-muted opacity-25 mb-3" />
                            <h5 className="text-muted fw-bold">Selecciona un Equipo</h5>
                            <p className="text-muted text-center max-w-sm">
                                Elige un equipo de la lista para ver y controlar sus partidos en tiempo real
                            </p>
                        </div>
                    ) : (
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white border-0 py-3 px-4">
                                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                    <Trophy className="text-primary" /> Partidos de {selectedEquipo?.nombre}
                                </h5>
                            </Card.Header>
                            <Card.Body className="p-0">
                                {loadingMatches ? (
                                    <div className="text-center py-5">
                                        <Spinner animation="border" variant="primary" size="sm" />
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <Table hover className="align-middle mb-0">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="ps-4 small text-muted text-uppercase">Jornada</th>
                                                    <th className="small text-muted text-uppercase">Rival</th>
                                                    <th className="small text-muted text-uppercase text-center">Marcador</th>
                                                    <th className="small text-muted text-uppercase">Fecha</th>
                                                    <th className="pe-4 small text-muted text-uppercase text-end">Control Real-Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {matches.length === 0 && (
                                                    <tr>
                                                        <td colSpan="5" className="text-center py-5 text-muted">
                                                            No hay partidos programados para este equipo.
                                                        </td>
                                                    </tr>
                                                )}
                                                {matches.map(p => {
                                                    const esLocal = p.equipoLocalId === selectedEquipoId
                                                    const rivalId = esLocal ? p.equipoVisitanteId : p.equipoLocalId
                                                    const rivalNombre = equiposById.get(rivalId) || 'Desconocido'
                                                    const isPending = p.resultado === 'PENDIENTE'

                                                    return (
                                                        <tr key={p.id} className={isPending ? 'table-active' : ''}>
                                                            <td className="ps-4">
                                                                <Badge bg="secondary" className="bg-opacity-10 text-secondary border">
                                                                    J{p.jornada}
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <Badge bg={esLocal ? 'primary' : 'secondary'} className="px-2 py-1">
                                                                        {esLocal ? 'LOCAL' : 'VISITANTE'}
                                                                    </Badge>
                                                                    <span className="fw-semibold">{rivalNombre}</span>
                                                                </div>
                                                            </td>
                                                            <td className="text-center">
                                                                <div className="fw-bold h5 mb-0">
                                                                    {p.golesLocal} <span className="text-muted small">-</span> {p.golesVisitante}
                                                                </div>
                                                            </td>
                                                            <td className="small text-muted">
                                                                {p.fechaProgramada
                                                                    ? new Date(p.fechaProgramada).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                                                                    : 'Sin programar'}
                                                            </td>
                                                            <td className="pe-4 text-end">
                                                                {isPending ? (
                                                                    <div className="d-flex justify-content-end align-items-center gap-2">
                                                                        <div className="d-flex align-items-center gap-1 border rounded-pill px-2 py-1 bg-light">
                                                                            <Button
                                                                                size="sm"
                                                                                variant="link"
                                                                                className="p-0 text-decoration-none text-danger fw-bold"
                                                                                onClick={() => handleRealTimeUpdate(p.id, Math.max(0, p.golesLocal - 1), p.golesVisitante)}
                                                                            >
                                                                                -
                                                                            </Button>
                                                                            <span className="px-1 small fw-bold">{p.golesLocal}</span>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="link"
                                                                                className="p-0 text-decoration-none text-success fw-bold"
                                                                                onClick={() => handleRealTimeUpdate(p.id, p.golesLocal + 1, p.golesVisitante)}
                                                                            >
                                                                                +
                                                                            </Button>
                                                                            <span className="mx-1 text-muted">|</span>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="link"
                                                                                className="p-0 text-decoration-none text-danger fw-bold"
                                                                                onClick={() => handleRealTimeUpdate(p.id, p.golesLocal, Math.max(0, p.golesVisitante - 1))}
                                                                            >
                                                                                -
                                                                            </Button>
                                                                            <span className="px-1 small fw-bold">{p.golesVisitante}</span>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="link"
                                                                                className="p-0 text-decoration-none text-success fw-bold"
                                                                                onClick={() => handleRealTimeUpdate(p.id, p.golesLocal, p.golesVisitante + 1)}
                                                                            >
                                                                                +
                                                                            </Button>
                                                                        </div>
                                                                        <Button
                                                                            variant="primary"
                                                                            size="sm"
                                                                            className="rounded-pill px-3 shadow-sm"
                                                                            onClick={() => {
                                                                                setSelectedPartido(p);
                                                                                setShowEventoModal(true);
                                                                            }}
                                                                        >
                                                                            <Balloon size={14} className="me-1" /> Evento
                                                                        </Button>
                                                                    </div>
                                                                ) : (
                                                                    <Badge bg="light" text="dark" className="border">Finalizado</Badge>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>

            {/* Modal de Eventos */}
            <Modal show={showEventoModal} onHide={() => setShowEventoModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">Registrar Evento en Vivo</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleEventoSubmit}>
                    <Modal.Body className="pt-3">
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted text-uppercase">Tipo de Evento</Form.Label>
                            <Form.Select
                                value={eventoForm.tipo}
                                onChange={(e) => setEventoForm({ ...eventoForm, tipo: e.target.value })}
                                className="border-0 bg-light shadow-none py-2"
                            >
                                <option value="GOL">⚽ Gol</option>
                                <option value="ASISTENCIA">🅰️ Asistencia</option>
                                <option value="TARJETA_AMARILLA">🟨 Tarjeta Amarilla</option>
                                <option value="TARJETA_ROJA">🟥 Tarjeta Roja</option>
                                <option value="AUTOGOL">⚽ Autogol</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted text-uppercase">Minuto</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="120"
                                value={eventoForm.minuto}
                                onChange={(e) => setEventoForm({ ...eventoForm, minuto: Number(e.target.value) })}
                                className="border-0 bg-light shadow-none py-2"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted text-uppercase">Jugador Protagonista</Form.Label>
                            <Form.Select
                                value={eventoForm.jugadorId}
                                onChange={(e) => setEventoForm({ ...eventoForm, jugadorId: e.target.value })}
                                className="border-0 bg-light shadow-none py-2"
                                required
                            >
                                <option value="">Seleccionar jugador...</option>
                                <optgroup label="Equipo Local">
                                    {jugadoresPartido.filter(j => j.equipo === 'Local').map(j => (
                                        <option key={j.id} value={j.id}>
                                            {j.nombre} (#{j.numeroCamiseta})
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="Equipo Visitante">
                                    {jugadoresPartido.filter(j => j.equipo === 'Visitante').map(j => (
                                        <option key={j.id} value={j.id}>
                                            {j.nombre} (#{j.numeroCamiseta})
                                        </option>
                                    ))}
                                </optgroup>
                            </Form.Select>
                            <Form.Text className="text-muted small">
                                Solo se muestran jugadores activos de ambos equipos
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label className="small fw-bold text-muted text-uppercase">Descripción (Opcional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={eventoForm.descripcion}
                                onChange={(e) => setEventoForm({ ...eventoForm, descripcion: e.target.value })}
                                className="border-0 bg-light shadow-none"
                                placeholder="Ej: Tiro libre desde 25 metros..."
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                        <Button variant="light" onClick={() => setShowEventoModal(false)} className="px-4">
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit" className="px-4 shadow-sm" disabled={eventoMutation.isPending}>
                            {eventoMutation.isPending ? <Spinner size="sm" /> : 'Registrar Evento'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    )
}
