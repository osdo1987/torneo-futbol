import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
    Card,
    Col,
    Row,
    Spinner,
    Badge,
    ListGroup,
} from 'react-bootstrap'
import {
    Trophy,
    Clock,
    ShieldFill,
    Calendar2Event,
    CircleFill,
    PlayCircleFill,
    CheckCircleFill
} from 'react-bootstrap-icons'
import { apiGet } from '../api'

export default function PartidosEnVivoPage({ selectedTorneoId }) {
    const [selectedPartido, setSelectedPartido] = useState(null)
    const [currentTime, setCurrentTime] = useState(new Date())

    // Actualizar la hora cada segundo para mostrar tiempo transcurrido
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const { data: partidos = [], isLoading: loadingPartidos } = useQuery({
        queryKey: ['partidos-torneo', selectedTorneoId],
        queryFn: () => apiGet(`/partidos/torneo/${selectedTorneoId}`),
        enabled: !!selectedTorneoId,
        refetchInterval: 5000, // Actualizar cada 5 segundos
    })

    const { data: eventos = [], isLoading: loadingEventos } = useQuery({
        queryKey: ['partido-eventos', selectedPartido?.id],
        queryFn: () => apiGet(`/partidos/${selectedPartido.id}/eventos`),
        enabled: !!selectedPartido,
        refetchInterval: 3000, // Actualizar cada 3 segundos
    })

    const { data: equipos = [] } = useQuery({
        queryKey: ['equipos', selectedTorneoId],
        queryFn: () => apiGet(`/torneos/${selectedTorneoId}/equipos`),
        enabled: !!selectedTorneoId,
    })

    const equiposById = new Map(equipos.map(e => [e.id, e]))

    // Filtrar partidos por estado
    const partidosEnVivo = partidos.filter(p => p.resultado === 'PENDIENTE' && p.golesLocal + p.golesVisitante > 0)
    const partidosPendientes = partidos.filter(p => p.resultado === 'PENDIENTE' && p.golesLocal + p.golesVisitante === 0)
    const partidosFinalizados = partidos.filter(p => p.resultado !== 'PENDIENTE').slice(0, 5)

    // Auto-seleccionar el primer partido en vivo
    useEffect(() => {
        if (!selectedPartido && partidosEnVivo.length > 0) {
            setSelectedPartido(partidosEnVivo[0])
        }
    }, [partidosEnVivo, selectedPartido])

    const getEventIcon = (tipo) => {
        switch (tipo) {
            case 'GOL':
                return '⚽'
            case 'ASISTENCIA':
                return '🅰️'
            case 'TARJETA_AMARILLA':
                return '🟨'
            case 'TARJETA_ROJA':
                return '🟥'
            case 'AUTOGOL':
                return '⚽'
            default:
                return '📝'
        }
    }

    const getEstadoPartido = (partido) => {
        if (partido.resultado !== 'PENDIENTE') {
            return { texto: 'FINALIZADO', variant: 'dark', icon: CheckCircleFill }
        }
        if (partido.golesLocal + partido.golesVisitante > 0) {
            return { texto: 'EN VIVO', variant: 'danger', icon: CircleFill, pulso: true }
        }
        return { texto: 'PRÓXIMO', variant: 'warning', icon: PlayCircleFill }
    }

    if (!selectedTorneoId) {
        return (
            <div className="text-center py-5">
                <Calendar2Event size={48} className="text-muted mb-3 opacity-25" />
                <h3 className="text-muted">Partidos en Vivo</h3>
                <p className="text-muted">Selecciona un torneo para ver los partidos en tiempo real.</p>
            </div>
        )
    }

    return (
        <div className="container-fluid p-0 fade-in">
            <header className="mb-4">
                <h1 className="display-6 fw-bold mb-1">Partidos en Vivo</h1>
                <p className="text-muted">Sigue los partidos en tiempo real</p>
            </header>

            <Row className="g-4">
                {/* Lista de Partidos */}
                <Col lg={4}>
                    <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
                        <Card.Header className="bg-white border-0 py-3 px-4">
                            <h5 className="mb-0 fw-bold">Todos los Partidos</h5>
                        </Card.Header>
                        <Card.Body className="p-0" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                            {loadingPartidos ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" size="sm" />
                                </div>
                            ) : (
                                <>
                                    {/* Partidos en Vivo */}
                                    {partidosEnVivo.length > 0 && (
                                        <div className="mb-3">
                                            <div className="px-3 py-2 bg-danger bg-opacity-10">
                                                <small className="text-danger fw-bold text-uppercase d-flex align-items-center gap-2">
                                                    <CircleFill size={8} className="blink-animation" />
                                                    En Vivo
                                                </small>
                                            </div>
                                            <ListGroup variant="flush">
                                                {partidosEnVivo.map(partido => {
                                                    const local = equiposById.get(partido.equipoLocalId)
                                                    const visitante = equiposById.get(partido.equipoVisitanteId)
                                                    const estado = getEstadoPartido(partido)
                                                    const isSelected = selectedPartido?.id === partido.id

                                                    return (
                                                        <ListGroup.Item
                                                            key={partido.id}
                                                            action
                                                            active={isSelected}
                                                            onClick={() => setSelectedPartido(partido)}
                                                            className="border-0 py-3"
                                                        >
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <Badge bg="secondary" className="bg-opacity-10 text-secondary">
                                                                    J{partido.jornada}
                                                                </Badge>
                                                                <Badge bg={estado.variant} className={estado.pulso ? 'pulse-badge' : ''}>
                                                                    {estado.pulso && <estado.icon size={8} className="me-1" />}
                                                                    {estado.texto}
                                                                </Badge>
                                                            </div>
                                                            <div className="fw-semibold small mb-1">{local?.nombre || 'Local'}</div>
                                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                                <div className="text-muted small">vs</div>
                                                                <div className="fw-bold h5 mb-0">
                                                                    {partido.golesLocal} - {partido.golesVisitante}
                                                                </div>
                                                            </div>
                                                            <div className="fw-semibold small">{visitante?.nombre || 'Visitante'}</div>
                                                        </ListGroup.Item>
                                                    )
                                                })}
                                            </ListGroup>
                                        </div>
                                    )}

                                    {/* Partidos Próximos */}
                                    {partidosPendientes.length > 0 && (
                                        <div className="mb-3">
                                            <div className="px-3 py-2 bg-warning bg-opacity-10">
                                                <small className="text-warning fw-bold text-uppercase">Próximos</small>
                                            </div>
                                            <ListGroup variant="flush">
                                                {partidosPendientes.map(partido => {
                                                    const local = equiposById.get(partido.equipoLocalId)
                                                    const visitante = equiposById.get(partido.equipoVisitanteId)
                                                    const estado = getEstadoPartido(partido)
                                                    const isSelected = selectedPartido?.id === partido.id

                                                    return (
                                                        <ListGroup.Item
                                                            key={partido.id}
                                                            action
                                                            active={isSelected}
                                                            onClick={() => setSelectedPartido(partido)}
                                                            className="border-0 py-3"
                                                        >
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <Badge bg="secondary" className="bg-opacity-10 text-secondary">
                                                                    J{partido.jornada}
                                                                </Badge>
                                                                <Badge bg={estado.variant}>
                                                                    <estado.icon size={10} className="me-1" />
                                                                    {estado.texto}
                                                                </Badge>
                                                            </div>
                                                            <div className="fw-semibold small mb-1">{local?.nombre || 'Local'}</div>
                                                            <div className="text-muted small mb-1">vs</div>
                                                            <div className="fw-semibold small">{visitante?.nombre || 'Visitante'}</div>
                                                            {partido.fechaProgramada && (
                                                                <div className="text-muted small mt-2">
                                                                    <Clock size={12} className="me-1" />
                                                                    {new Date(partido.fechaProgramada).toLocaleString([], {
                                                                        dateStyle: 'short',
                                                                        timeStyle: 'short'
                                                                    })}
                                                                </div>
                                                            )}
                                                        </ListGroup.Item>
                                                    )
                                                })}
                                            </ListGroup>
                                        </div>
                                    )}

                                    {/* Partidos Finalizados */}
                                    {partidosFinalizados.length > 0 && (
                                        <div>
                                            <div className="px-3 py-2 bg-dark bg-opacity-10">
                                                <small className="text-dark fw-bold text-uppercase">Finalizados</small>
                                            </div>
                                            <ListGroup variant="flush">
                                                {partidosFinalizados.map(partido => {
                                                    const local = equiposById.get(partido.equipoLocalId)
                                                    const visitante = equiposById.get(partido.equipoVisitanteId)
                                                    const estado = getEstadoPartido(partido)
                                                    const isSelected = selectedPartido?.id === partido.id

                                                    return (
                                                        <ListGroup.Item
                                                            key={partido.id}
                                                            action
                                                            active={isSelected}
                                                            onClick={() => setSelectedPartido(partido)}
                                                            className="border-0 py-3"
                                                        >
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <Badge bg="secondary" className="bg-opacity-10 text-secondary">
                                                                    J{partido.jornada}
                                                                </Badge>
                                                                <Badge bg={estado.variant}>
                                                                    <estado.icon size={10} className="me-1" />
                                                                    {estado.texto}
                                                                </Badge>
                                                            </div>
                                                            <div className="fw-semibold small mb-1">{local?.nombre || 'Local'}</div>
                                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                                <div className="text-muted small">vs</div>
                                                                <div className="fw-bold h6 mb-0">
                                                                    {partido.golesLocal} - {partido.golesVisitante}
                                                                </div>
                                                            </div>
                                                            <div className="fw-semibold small">{visitante?.nombre || 'Visitante'}</div>
                                                        </ListGroup.Item>
                                                    )
                                                })}
                                            </ListGroup>
                                        </div>
                                    )}

                                    {partidos.length === 0 && (
                                        <div className="text-center py-5 text-muted">
                                            <Calendar2Event size={32} className="mb-2 opacity-25" />
                                            <p className="mb-0 small">No hay partidos programados</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Detalle del Partido Seleccionado */}
                <Col lg={8}>
                    {!selectedPartido ? (
                        <div className="h-100 d-flex flex-column align-items-center justify-content-center p-5 bg-white rounded-4 shadow-sm border border-dashed">
                            <Trophy size={48} className="text-muted opacity-25 mb-3" />
                            <h5 className="text-muted fw-bold">Selecciona un Partido</h5>
                            <p className="text-muted text-center max-w-sm">
                                Elige un partido de la lista para ver los detalles en tiempo real
                            </p>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-4">
                            {/* Marcador Principal */}
                            <Card className="border-0 shadow-lg overflow-hidden">
                                <div className="bg-gradient-primary text-white p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <Badge bg="light" text="dark" className="px-3 py-2">
                                            Jornada {selectedPartido.jornada}
                                        </Badge>
                                        {(() => {
                                            const estado = getEstadoPartido(selectedPartido)
                                            return (
                                                <Badge
                                                    bg={estado.variant}
                                                    className={`px-3 py-2 ${estado.pulso ? 'pulse-badge' : ''}`}
                                                >
                                                    {estado.pulso && <estado.icon size={10} className="me-2" />}
                                                    {estado.texto}
                                                </Badge>
                                            )
                                        })()}
                                    </div>

                                    <Row className="align-items-center text-center">
                                        {/* Equipo Local */}
                                        <Col xs={5}>
                                            <ShieldFill size={48} className="mb-3 opacity-75" />
                                            <h4 className="fw-bold mb-1">
                                                {equiposById.get(selectedPartido.equipoLocalId)?.nombre || 'Local'}
                                            </h4>
                                            <small className="opacity-75">LOCAL</small>
                                        </Col>

                                        {/* Marcador */}
                                        <Col xs={2}>
                                            <div className="display-2 fw-bold">
                                                {selectedPartido.golesLocal}
                                            </div>
                                            <div className="h5 opacity-75">-</div>
                                            <div className="display-2 fw-bold">
                                                {selectedPartido.golesVisitante}
                                            </div>
                                        </Col>

                                        {/* Equipo Visitante */}
                                        <Col xs={5}>
                                            <ShieldFill size={48} className="mb-3 opacity-75" />
                                            <h4 className="fw-bold mb-1">
                                                {equiposById.get(selectedPartido.equipoVisitanteId)?.nombre || 'Visitante'}
                                            </h4>
                                            <small className="opacity-75">VISITANTE</small>
                                        </Col>
                                    </Row>

                                    {selectedPartido.fechaProgramada && (
                                        <div className="text-center mt-4 opacity-75">
                                            <Clock size={16} className="me-2" />
                                            <small>
                                                {new Date(selectedPartido.fechaProgramada).toLocaleString([], {
                                                    dateStyle: 'long',
                                                    timeStyle: 'short'
                                                })}
                                            </small>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Eventos del Partido */}
                            <Card className="border-0 shadow-sm">
                                <Card.Header className="bg-white border-0 py-3 px-4">
                                    <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                        <Calendar2Event className="text-primary" />
                                        Eventos del Partido
                                    </h5>
                                </Card.Header>
                                <Card.Body className="p-4">
                                    {loadingEventos ? (
                                        <div className="text-center py-5">
                                            <Spinner animation="border" variant="primary" size="sm" />
                                        </div>
                                    ) : eventos.length > 0 ? (
                                        <div className="timeline">
                                            {eventos
                                                .sort((a, b) => b.minuto - a.minuto)
                                                .map((evento, index) => (
                                                    <div key={index} className="timeline-item mb-4">
                                                        <div className="d-flex gap-3 align-items-start">
                                                            <div className="timeline-badge">
                                                                <span className="fs-4">{getEventIcon(evento.tipo)}</span>
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <div className="d-flex justify-content-between align-items-start mb-1">
                                                                    <div>
                                                                        <Badge bg="primary" className="me-2">
                                                                            {evento.minuto}'
                                                                        </Badge>
                                                                        <span className="fw-bold">
                                                                            {evento.tipo.replace('_', ' ')}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-muted small">
                                                                    {evento.jugadorNombre || 'Jugador desconocido'}
                                                                </div>
                                                                {evento.descripcion && (
                                                                    <div className="text-muted small mt-1">
                                                                        {evento.descripcion}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-5 text-muted">
                                            <Calendar2Event size={32} className="mb-2 opacity-25" />
                                            <p className="mb-0">No hay eventos registrados aún</p>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </div>
                    )}
                </Col>
            </Row>

            <style>{`
                .blink-animation {
                    animation: blink 1.5s infinite;
                }

                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }

                .pulse-badge {
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); }
                    50% { box-shadow: 0 0 0 8px rgba(220, 53, 69, 0); }
                }

                .bg-gradient-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }

                .timeline-item {
                    position: relative;
                    padding-left: 0;
                }

                .timeline-badge {
                    width: 50px;
                    height: 50px;
                    background: #f8f9fa;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
            `}</style>
        </div>
    )
}
