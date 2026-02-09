import { useQuery } from '@tanstack/react-query'
import { Card, Row, Col, Table, Spinner, Badge, ProgressBar } from 'react-bootstrap'
import { Trophy, PersonFill, HeartFill, ShieldFill, StarFill, BarChartFill } from 'react-bootstrap-icons'
import { apiGet } from '../api'

export default function EstadisticasPage({ selectedTorneoId }) {
    const { data: goleadores = {}, isLoading: loadingGoleadores } = useQuery({
        queryKey: ['goleadores', selectedTorneoId],
        queryFn: () => apiGet(`/estadisticas/torneo/${selectedTorneoId}/goleadores`),
        enabled: !!selectedTorneoId
    })

    const { data: fairPlay = {}, isLoading: loadingFairPlay } = useQuery({
        queryKey: ['fairplay', selectedTorneoId],
        queryFn: () => apiGet(`/estadisticas/torneo/${selectedTorneoId}/fairplay`),
        enabled: !!selectedTorneoId
    })

    const { data: equipos = [] } = useQuery({
        queryKey: ['equipos', selectedTorneoId],
        queryFn: () => apiGet(`/torneos/${selectedTorneoId}/equipos`),
        enabled: !!selectedTorneoId
    })

    // Fetch all players for the tournament to have a name map
    const { data: jugadoresRaw = [], isLoading: loadingJugadores } = useQuery({
        queryKey: ['jugadores-torneo', selectedTorneoId],
        queryFn: async () => {
            const results = await Promise.all(
                equipos.map(e => apiGet(`/torneos/${selectedTorneoId}/equipos/${e.id}/jugadores`))
            );
            return results.flat();
        },
        enabled: !!selectedTorneoId && equipos.length > 0
    })

    const jugadoresMap = new Map(jugadoresRaw.map(j => [j.id, j]))
    const equiposMap = new Map(equipos.map(e => [e.id, e.nombre]))

    const getPlayerName = (id) => jugadoresMap.get(id)?.nombre || `Jugador ${id.substring(0, 5)}`;
    const getPlayerTeam = (id) => {
        const teamId = jugadoresMap.get(id)?.equipoId;
        return equiposMap.get(teamId) || 'Delegación Desconocida';
    }

    if (!selectedTorneoId) return (
        <div className="text-center py-5">
            <BarChartFill size={64} className="text-muted opacity-25 mb-3" />
            <h3 className="text-muted">Estadísticas no cargadas</h3>
            <p className="text-muted">Selecciona un torneo para visualizar el rendimiento deportivo.</p>
        </div>
    )

    const loading = loadingGoleadores || loadingFairPlay || loadingJugadores;

    return (
        <div className="fade-in container-fluid p-0">
            <header className="mb-5 d-flex justify-content-between align-items-end">
                <div>
                    <h1 className="display-6 fw-bold mb-1">Elite Stats Center</h1>
                    <p className="text-muted mb-0">Análisis técnico y disciplina deportiva en tiempo real</p>
                </div>
                <Badge bg="dark" className="px-3 py-2">LIVE DATA</Badge>
            </header>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="grow" variant="primary" />
                    <p className="mt-3 text-muted">Sincronizando registros oficiales...</p>
                </div>
            ) : (
                <Row className="g-5">
                    <Col xl={6}>
                        <Card className="border-0 shadow-lg overflow-hidden" style={{ borderRadius: '1.5rem' }}>
                            <div className="bg-primary text-white p-4 d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-white bg-opacity-20 p-2 rounded-3">
                                        <Trophy size={24} />
                                    </div>
                                    <h4 className="mb-0 fw-bold">Bota de Oro</h4>
                                </div>
                                <StarFill className="text-warning" />
                            </div>
                            <Card.Body className="p-0">
                                <Table responsive hover className="mb-0">
                                    <tbody>
                                        {Object.entries(goleadores).sort((a, b) => b[1] - a[1]).map(([id, goles], idx) => (
                                            <tr key={id} className="align-middle">
                                                <td className="ps-4 py-3" style={{ width: '40px' }}>
                                                    <div className={`fw-bold h5 mb-0 ${idx === 0 ? 'text-warning' : 'text-muted'}`}>
                                                        {idx + 1}º
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: 45, height: 45 }}>
                                                            <PersonFill size={20} className="text-primary" />
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold">{getPlayerName(id)}</div>
                                                            <div className="text-muted small d-flex align-items-center gap-1">
                                                                <ShieldFill size={10} /> {getPlayerTeam(id)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="pe-4 text-end">
                                                    <div className="d-flex flex-column align-items-end">
                                                        <div className="h4 fw-bold mb-0 text-primary">{goles}</div>
                                                        <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.6rem' }}>Goles</small>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {Object.keys(goleadores).length === 0 && (
                                            <tr><td className="text-center py-5 text-muted">La red aún no se ha movido.</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={6}>
                        <Card className="border-0 shadow-lg overflow-hidden" style={{ borderRadius: '1.5rem' }}>
                            <div className="bg-danger text-white p-4 d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-white bg-opacity-20 p-2 rounded-3">
                                        <HeartFill size={24} />
                                    </div>
                                    <h4 className="mb-0 fw-bold">Fair Play Index</h4>
                                </div>
                                <ShieldFill className="text-white" />
                            </div>
                            <Card.Body className="p-4">
                                <p className="text-muted small mb-4 text-uppercase fw-bold">Jugadores con mayor puntaje de infracción (Amarilla: 1pt, Roja: 3pts)</p>
                                {Object.entries(fairPlay).sort((a, b) => b[1] - a[1]).map(([id, pts]) => (
                                    <div key={id} className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <div>
                                                <span className="fw-bold">{getPlayerName(id)}</span>
                                                <span className="text-muted small ms-2 mx-1">•</span>
                                                <span className="text-muted small">{getPlayerTeam(id)}</span>
                                            </div>
                                            <Badge bg="danger" pill className="px-2">{pts} pts</Badge>
                                        </div>
                                        <ProgressBar
                                            variant={pts > 5 ? 'danger' : 'warning'}
                                            now={(pts / 10) * 100}
                                            style={{ height: '6px', borderRadius: '3px' }}
                                        />
                                    </div>
                                ))}
                                {Object.keys(fairPlay).length === 0 && (
                                    <div className="text-center py-4 text-muted border border-dashed rounded-4">
                                        Felicidades: No hay jugadores sancionados aún.
                                    </div>
                                )}
                                <div className="mt-5 p-3 bg-light rounded-4 border-start border-danger border-4">
                                    <h6 className="fw-bold mb-1">¿Sabías qué?</h6>
                                    <p className="small text-muted mb-0">Un puntaje alto de Fair Play puede resultar en la descalificación automática del equipo para la siguiente ronda según el reglamento oficial.</p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    )
}
