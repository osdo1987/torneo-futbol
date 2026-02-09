import { useQuery } from '@tanstack/react-query'
import { Card, Row, Col, Table, Spinner, Badge } from 'react-bootstrap'
import { Trophy, Person, ShieldCheck, Heart } from 'react-bootstrap-icons'
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

    const equiposMap = new Map(equipos.map(e => [e.id, e.nombre]))

    if (!selectedTorneoId) return <div className="p-4 text-center">Selecciona un torneo</div>

    return (
        <div className="fade-in">
            <header className="mb-5">
                <h1 className="display-6 fw-bold mb-1">Centro de Estadísticas</h1>
                <p className="text-muted">Líderes individuales y comportamiento deportivo del torneo</p>
            </header>

            <Row className="g-4">
                <Col md={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white border-0 py-3 px-4 d-flex align-items-center gap-2">
                            <Person className="text-primary" />
                            <h5 className="mb-0 fw-bold">Goleadores</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {loadingGoleadores ? <div className="p-5 text-center"><Spinner animation="border" /></div> : (
                                <Table hover responsive className="mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="ps-4">Jugador</th>
                                            <th className="text-center">Goles</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(goleadores).sort((a, b) => b[1] - a[1]).map(([id, goles]) => (
                                            <tr key={id}>
                                                <td className="ps-4">
                                                    <div className="fw-bold">Jugador {id.substring(0, 8)}</div>
                                                    <small className="text-muted">Equipo ID: {id.substring(0, 4)}</small>
                                                </td>
                                                <td className="text-center">
                                                    <Badge bg="primary" className="rounded-pill px-3">{goles}</Badge>
                                                </td>
                                            </tr>
                                        ))}
                                        {Object.keys(goleadores).length === 0 && (
                                            <tr><td colSpan="2" className="text-center py-4 text-muted">No hay goles registrados</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white border-0 py-3 px-4 d-flex align-items-center gap-2">
                            <Heart className="text-danger" />
                            <h5 className="mb-0 fw-bold">Fair Play (Puntos de Infracción)</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {loadingFairPlay ? <div className="p-5 text-center"><Spinner animation="border" /></div> : (
                                <Table hover responsive className="mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="ps-4">Equipo / Jugador</th>
                                            <th className="text-center">Puntos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(fairPlay).sort((a, b) => a[1] - b[1]).map(([id, pts]) => (
                                            <tr key={id}>
                                                <td className="ps-4">
                                                    <div className="fw-bold">ID: {id.substring(0, 8)}</div>
                                                </td>
                                                <td className="text-center text-danger fw-bold">{pts}</td>
                                            </tr>
                                        ))}
                                        {Object.keys(fairPlay).length === 0 && (
                                            <tr><td colSpan="2" className="text-center py-4 text-muted">No hay tarjetas registradas</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
