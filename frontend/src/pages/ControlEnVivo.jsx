import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    Button,
    Card,
    Col,
    Row,
    Spinner,
    Alert,
    Form,
    Badge,
    ButtonGroup,
} from 'react-bootstrap'
import {
    Trophy,
    Clock,
    PlayFill,
    StopFill,
    PauseFill,
    Calendar2Event,
    ShieldFill,
    PersonFill,
    PlusCircleFill,
    DashCircleFill,
    XCircleFill
} from 'react-bootstrap-icons'
import { apiGet, apiPost, apiPut } from '../api'

export default function ControlEnVivoPage({ selectedTorneoId }) {
    const queryClient = useQueryClient()
    const [selectedPartido, setSelectedPartido] = useState(null)

    // Estado del partido
    const [partidoIniciado, setPartidoIniciado] = useState(false)
    const [tiempoActual, setTiempoActual] = useState('PRIMER_TIEMPO') // PRIMER_TIEMPO, DESCANSO, SEGUNDO_TIEMPO, FINALIZADO
    const [cronometroActivo, setCronometroActivo] = useState(false)
    const [segundos, setSegundos] = useState(0)

    // Marcador
    const [golesLocal, setGolesLocal] = useState(0)
    const [golesVisitante, setGolesVisitante] = useState(0)

    // Formulario de evento rápido
    const [eventoRapido, setEventoRapido] = useState({
        tipo: 'GOL',
        jugadorId: '',
        equipo: 'LOCAL'
    })

    const { data: partidos = [], isLoading: loadingPartidos } = useQuery({
        queryKey: ['partidos-pendientes', selectedTorneoId],
        queryFn: () => apiGet(`/partidos/torneo/${selectedTorneoId}`),
        enabled: !!selectedTorneoId,
        select: (data) => data.filter(p => p.resultado === 'PENDIENTE')
    })

    const { data: equipos = [] } = useQuery({
        queryKey: ['equipos', selectedTorneoId],
        queryFn: () => apiGet(`/torneos/${selectedTorneoId}/equipos`),
        enabled: !!selectedTorneoId,
    })

    const { data: jugadoresLocal = [] } = useQuery({
        queryKey: ['jugadores-local', selectedPartido?.equipoLocalId],
        queryFn: () => apiGet(`/torneos/${selectedTorneoId}/equipos/${selectedPartido.equipoLocalId}/jugadores`),
        enabled: !!selectedPartido && !!selectedTorneoId,
    })

    const { data: jugadoresVisitante = [] } = useQuery({
        queryKey: ['jugadores-visitante', selectedPartido?.equipoVisitanteId],
        queryFn: () => apiGet(`/torneos/${selectedTorneoId}/equipos/${selectedPartido.equipoVisitanteId}/jugadores`),
        enabled: !!selectedPartido && !!selectedTorneoId,
    })

    const equiposById = useMemo(() => new Map(equipos.map(e => [e.id, e])), [equipos])

    // Cronómetro
    useEffect(() => {
        let interval
        if (cronometroActivo && partidoIniciado && tiempoActual !== 'DESCANSO' && tiempoActual !== 'FINALIZADO') {
            interval = setInterval(() => {
                setSegundos(s => s + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [cronometroActivo, partidoIniciado, tiempoActual])

    const formatTiempo = (segundos) => {
        const mins = Math.floor(segundos / 60)
        const secs = segundos % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const marcadorMutation = useMutation({
        mutationFn: ({ partidoId, golesLocal, golesVisitante }) =>
            apiPut(`/partidos/${partidoId}/marcador-realtime`, { golesLocal, golesVisitante }),
        onSuccess: () => queryClient.invalidateQueries(['partidos-pendientes']),
    })

    const eventoMutation = useMutation({
        mutationFn: ({ partidoId, ...evento }) => apiPost(`/partidos/${partidoId}/eventos`, evento),
        onSuccess: () => {
            setEventoRapido({ tipo: 'GOL', jugadorId: '', equipo: 'LOCAL' })
            queryClient.invalidateQueries(['partido-eventos'])
        },
    })

    const handleIniciarPartido = () => {
        setPartidoIniciado(true)
        setTiempoActual('PRIMER_TIEMPO')
        setCronometroActivo(true)
        setSegundos(0)
        setGolesLocal(selectedPartido.golesLocal || 0)
        setGolesVisitante(selectedPartido.golesVisitante || 0)
    }

    const handleFinalizarPartido = () => {
        if (window.confirm('¿Estás seguro de finalizar el partido? Esta acción no se puede deshacer.')) {
            setTiempoActual('FINALIZADO')
            setCronometroActivo(false)
            // Aquí podrías hacer una llamada al backend para finalizar oficialmente el partido
            marcadorMutation.mutate({
                partidoId: selectedPartido.id,
                golesLocal,
                golesVisitante
            })
        }
    }

    const handleIniciarDescanso = () => {
        setTiempoActual('DESCANSO')
        setCronometroActivo(false)
    }

    const handleIniciarSegundoTiempo = () => {
        setTiempoActual('SEGUNDO_TIEMPO')
        setCronometroActivo(true)
        setSegundos(0)
    }

    const handleActualizarMarcador = (tipo, equipo) => {
        if (tipo === 'sumar') {
            if (equipo === 'local') {
                const nuevosGoles = golesLocal + 1
                setGolesLocal(nuevosGoles)
                marcadorMutation.mutate({ partidoId: selectedPartido.id, golesLocal: nuevosGoles, golesVisitante })
            } else {
                const nuevosGoles = golesVisitante + 1
                setGolesVisitante(nuevosGoles)
                marcadorMutation.mutate({ partidoId: selectedPartido.id, golesLocal, golesVisitante: nuevosGoles })
            }
        } else {
            if (equipo === 'local' && golesLocal > 0) {
                const nuevosGoles = golesLocal - 1
                setGolesLocal(nuevosGoles)
                marcadorMutation.mutate({ partidoId: selectedPartido.id, golesLocal: nuevosGoles, golesVisitante })
            } else if (equipo === 'visitante' && golesVisitante > 0) {
                const nuevosGoles = golesVisitante - 1
                setGolesVisitante(nuevosGoles)
                marcadorMutation.mutate({ partidoId: selectedPartido.id, golesLocal, golesVisitante: nuevosGoles })
            }
        }
    }

    const handleRegistrarEvento = () => {
        if (!eventoRapido.jugadorId) {
            alert('Selecciona un jugador')
            return
        }

        const minuto = Math.floor(segundos / 60)
        eventoMutation.mutate({
            partidoId: selectedPartido.id,
            jugadorId: eventoRapido.jugadorId,
            tipo: eventoRapido.tipo,
            minuto: minuto || 1,
            descripcion: `${eventoRapido.tipo} - ${tiempoActual}`
        })
    }

    const equipoLocal = selectedPartido ? equiposById.get(selectedPartido.equipoLocalId) : null
    const equipoVisitante = selectedPartido ? equiposById.get(selectedPartido.equipoVisitanteId) : null

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
            <header className="mb-4">
                <h1 className="display-6 fw-bold mb-1">Control de Partido en Vivo</h1>
                <p className="text-muted">Gestiona el partido en tiempo real con controles intuitivos</p>
            </header>

            <Row className="g-4">
                {/* Selector de Partido */}
                <Col lg={3}>
                    <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
                        <Card.Header className="bg-white border-0 py-3 px-4">
                            <h5 className="mb-0 fw-bold">Partidos Pendientes</h5>
                        </Card.Header>
                        <Card.Body className="p-2">
                            {loadingPartidos ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" size="sm" />
                                </div>
                            ) : (
                                <div className="d-grid gap-2">
                                    {partidos.map(partido => {
                                        const local = equiposById.get(partido.equipoLocalId)
                                        const visitante = equiposById.get(partido.equipoVisitanteId)
                                        return (
                                            <Button
                                                key={partido.id}
                                                variant={selectedPartido?.id === partido.id ? 'primary' : 'light'}
                                                className="text-start py-3 px-3"
                                                onClick={() => {
                                                    setSelectedPartido(partido)
                                                    setPartidoIniciado(false)
                                                    setTiempoActual('PRIMER_TIEMPO')
                                                    setSegundos(0)
                                                    setCronometroActivo(false)
                                                }}
                                                disabled={partidoIniciado && selectedPartido?.id !== partido.id}
                                            >
                                                <div className="small mb-1">
                                                    <Badge bg="secondary" className="bg-opacity-10 text-secondary">
                                                        Jornada {partido.jornada}
                                                    </Badge>
                                                </div>
                                                <div className="fw-semibold small">{local?.nombre || 'Local'}</div>
                                                <div className="text-muted small">vs</div>
                                                <div className="fw-semibold small">{visitante?.nombre || 'Visitante'}</div>
                                            </Button>
                                        )
                                    })}
                                    {partidos.length === 0 && (
                                        <div className="text-center py-4 text-muted small">
                                            No hay partidos pendientes
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Panel de Control Principal */}
                <Col lg={9}>
                    {!selectedPartido ? (
                        <div className="h-100 d-flex flex-column align-items-center justify-content-center p-5 bg-white rounded-4 shadow-sm border border-dashed">
                            <Trophy size={48} className="text-muted opacity-25 mb-3" />
                            <h5 className="text-muted fw-bold">Selecciona un Partido</h5>
                            <p className="text-muted text-center max-w-sm">
                                Elige un partido de la lista para comenzar el control en vivo
                            </p>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-4">
                            {/* Header del Partido */}
                            <Card className="border-0 shadow-sm">
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div>
                                            <Badge bg="secondary" className="mb-2">Jornada {selectedPartido.jornada}</Badge>
                                            <h4 className="fw-bold mb-0">
                                                {equipoLocal?.nombre} vs {equipoVisitante?.nombre}
                                            </h4>
                                        </div>
                                        {!partidoIniciado ? (
                                            <Button
                                                variant="success"
                                                size="lg"
                                                className="px-5 shadow"
                                                onClick={handleIniciarPartido}
                                            >
                                                <PlayFill size={20} className="me-2" />
                                                Iniciar Partido
                                            </Button>
                                        ) : tiempoActual !== 'FINALIZADO' ? (
                                            <Button
                                                variant="danger"
                                                size="lg"
                                                className="px-5 shadow"
                                                onClick={handleFinalizarPartido}
                                            >
                                                <StopFill size={20} className="me-2" />
                                                Finalizar Partido
                                            </Button>
                                        ) : (
                                            <Badge bg="dark" className="fs-5 px-4 py-3">
                                                PARTIDO FINALIZADO
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Marcador y Cronómetro */}
                                    {partidoIniciado && (
                                        <div className="bg-light rounded-4 p-4">
                                            <Row className="align-items-center">
                                                {/* Equipo Local */}
                                                <Col md={4} className="text-center">
                                                    <div className="mb-3">
                                                        <ShieldFill size={32} className="text-primary mb-2" />
                                                        <h5 className="fw-bold mb-0">{equipoLocal?.nombre}</h5>
                                                        <small className="text-muted">LOCAL</small>
                                                    </div>
                                                    <div className="display-1 fw-bold text-primary mb-3">{golesLocal}</div>
                                                    <ButtonGroup>
                                                        <Button
                                                            variant="outline-danger"
                                                            onClick={() => handleActualizarMarcador('restar', 'local')}
                                                            disabled={tiempoActual === 'FINALIZADO'}
                                                        >
                                                            <DashCircleFill />
                                                        </Button>
                                                        <Button
                                                            variant="outline-success"
                                                            onClick={() => handleActualizarMarcador('sumar', 'local')}
                                                            disabled={tiempoActual === 'FINALIZADO'}
                                                        >
                                                            <PlusCircleFill />
                                                        </Button>
                                                    </ButtonGroup>
                                                </Col>

                                                {/* Cronómetro Central */}
                                                <Col md={4} className="text-center">
                                                    <div className="mb-3">
                                                        <Clock size={40} className="text-warning mb-2" />
                                                        <div className="display-3 fw-bold mb-2">{formatTiempo(segundos)}</div>
                                                        <Badge
                                                            bg={tiempoActual === 'PRIMER_TIEMPO' ? 'success' : tiempoActual === 'SEGUNDO_TIEMPO' ? 'info' : 'warning'}
                                                            className="fs-6 px-3 py-2"
                                                        >
                                                            {tiempoActual === 'PRIMER_TIEMPO' && '1er TIEMPO'}
                                                            {tiempoActual === 'DESCANSO' && 'DESCANSO'}
                                                            {tiempoActual === 'SEGUNDO_TIEMPO' && '2do TIEMPO'}
                                                            {tiempoActual === 'FINALIZADO' && 'FINALIZADO'}
                                                        </Badge>
                                                    </div>

                                                    {tiempoActual === 'PRIMER_TIEMPO' && (
                                                        <div className="d-flex gap-2 justify-content-center">
                                                            <Button
                                                                variant={cronometroActivo ? 'warning' : 'success'}
                                                                onClick={() => setCronometroActivo(!cronometroActivo)}
                                                            >
                                                                {cronometroActivo ? <PauseFill /> : <PlayFill />}
                                                            </Button>
                                                            <Button
                                                                variant="info"
                                                                onClick={handleIniciarDescanso}
                                                            >
                                                                Descanso
                                                            </Button>
                                                        </div>
                                                    )}

                                                    {tiempoActual === 'DESCANSO' && (
                                                        <Button
                                                            variant="success"
                                                            onClick={handleIniciarSegundoTiempo}
                                                        >
                                                            <PlayFill className="me-2" />
                                                            Iniciar 2do Tiempo
                                                        </Button>
                                                    )}

                                                    {tiempoActual === 'SEGUNDO_TIEMPO' && (
                                                        <Button
                                                            variant={cronometroActivo ? 'warning' : 'success'}
                                                            onClick={() => setCronometroActivo(!cronometroActivo)}
                                                        >
                                                            {cronometroActivo ? <PauseFill /> : <PlayFill />}
                                                        </Button>
                                                    )}
                                                </Col>

                                                {/* Equipo Visitante */}
                                                <Col md={4} className="text-center">
                                                    <div className="mb-3">
                                                        <ShieldFill size={32} className="text-secondary mb-2" />
                                                        <h5 className="fw-bold mb-0">{equipoVisitante?.nombre}</h5>
                                                        <small className="text-muted">VISITANTE</small>
                                                    </div>
                                                    <div className="display-1 fw-bold text-secondary mb-3">{golesVisitante}</div>
                                                    <ButtonGroup>
                                                        <Button
                                                            variant="outline-danger"
                                                            onClick={() => handleActualizarMarcador('restar', 'visitante')}
                                                            disabled={tiempoActual === 'FINALIZADO'}
                                                        >
                                                            <DashCircleFill />
                                                        </Button>
                                                        <Button
                                                            variant="outline-success"
                                                            onClick={() => handleActualizarMarcador('sumar', 'visitante')}
                                                            disabled={tiempoActual === 'FINALIZADO'}
                                                        >
                                                            <PlusCircleFill />
                                                        </Button>
                                                    </ButtonGroup>
                                                </Col>
                                            </Row>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>

                            {/* Panel de Eventos Rápidos */}
                            {partidoIniciado && tiempoActual !== 'FINALIZADO' && (
                                <Card className="border-0 shadow-sm">
                                    <Card.Header className="bg-white border-0 py-3 px-4">
                                        <h5 className="mb-0 fw-bold">Registrar Evento Rápido</h5>
                                    </Card.Header>
                                    <Card.Body className="p-4">
                                        <Row className="g-3">
                                            <Col md={3}>
                                                <Form.Label className="small fw-bold text-muted">TIPO DE EVENTO</Form.Label>
                                                <Form.Select
                                                    value={eventoRapido.tipo}
                                                    onChange={(e) => setEventoRapido({ ...eventoRapido, tipo: e.target.value })}
                                                    className="py-2"
                                                >
                                                    <option value="GOL">⚽ Gol</option>
                                                    <option value="ASISTENCIA">🅰️ Asistencia</option>
                                                    <option value="TARJETA_AMARILLA">🟨 Tarjeta Amarilla</option>
                                                    <option value="TARJETA_ROJA">🟥 Tarjeta Roja</option>
                                                    <option value="AUTOGOL">⚽ Autogol</option>
                                                </Form.Select>
                                            </Col>
                                            <Col md={3}>
                                                <Form.Label className="small fw-bold text-muted">EQUIPO</Form.Label>
                                                <Form.Select
                                                    value={eventoRapido.equipo}
                                                    onChange={(e) => setEventoRapido({ ...eventoRapido, equipo: e.target.value, jugadorId: '' })}
                                                    className="py-2"
                                                >
                                                    <option value="LOCAL">🏠 {equipoLocal?.nombre}</option>
                                                    <option value="VISITANTE">✈️ {equipoVisitante?.nombre}</option>
                                                </Form.Select>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Label className="small fw-bold text-muted">JUGADOR</Form.Label>
                                                <Form.Select
                                                    value={eventoRapido.jugadorId}
                                                    onChange={(e) => setEventoRapido({ ...eventoRapido, jugadorId: e.target.value })}
                                                    className="py-2"
                                                >
                                                    <option value="">Seleccionar jugador...</option>
                                                    {(eventoRapido.equipo === 'LOCAL' ? jugadoresLocal : jugadoresVisitante).map(j => (
                                                        <option key={j.id} value={j.id}>
                                                            #{j.numeroCamiseta} - {j.nombre}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Col>
                                            <Col md={2} className="d-flex align-items-end">
                                                <Button
                                                    variant="primary"
                                                    className="w-100 py-2"
                                                    onClick={handleRegistrarEvento}
                                                    disabled={eventoMutation.isPending}
                                                >
                                                    {eventoMutation.isPending ? <Spinner size="sm" /> : 'Registrar'}
                                                </Button>
                                            </Col>
                                        </Row>
                                        <div className="mt-3 text-muted small">
                                            <Clock size={14} className="me-1" />
                                            El evento se registrará en el minuto: <strong>{Math.floor(segundos / 60)}'</strong>
                                        </div>
                                    </Card.Body>
                                </Card>
                            )}
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    )
}
