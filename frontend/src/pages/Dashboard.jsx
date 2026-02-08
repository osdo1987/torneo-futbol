import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Card,
  Table,
  ListGroup,
} from 'react-bootstrap'
import { apiGet } from '../api'

function StatCard({ title, value, trend }) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text as="h2">{value}</Card.Text>
        <Card.Text className="text-muted">{trend}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default function Dashboard({ selectedTorneoId }) {
  const { data: torneos = [] } = useQuery({
    queryKey: ['torneos'],
    queryFn: () => apiGet('/torneos'),
  })

  const { data: partidos = [], isLoading: loadingPartidos } = useQuery({
    queryKey: ['partidos', selectedTorneoId],
    queryFn: () => apiGet(`/partidos/torneo/${selectedTorneoId}`),
    enabled: !!selectedTorneoId,
  })

  const { data: tabla = [], isLoading: loadingTabla } = useQuery({
    queryKey: ['tabla', selectedTorneoId],
    queryFn: () => apiGet(`/torneos/${selectedTorneoId}/tabla`),
    enabled: !!selectedTorneoId,
  })

  const { data: equipos = [] } = useQuery({
    queryKey: ['equipos', selectedTorneoId],
    queryFn: () => apiGet(`/torneos/${selectedTorneoId}/equipos`),
    enabled: !!selectedTorneoId,
  })

  const equiposById = useMemo(() => new Map(equipos.map(e => [e.id, e.nombre])), [equipos])
  const selectedTorneo = useMemo(() => torneos.find(t => t.id === selectedTorneoId), [torneos, selectedTorneoId])

  const stats = useMemo(() => {
    const activos = torneos.filter((t) => t.estado !== 'FINALIZADO').length
    const equiposCount = tabla.length
    const jugados = partidos.filter((p) => p.resultado !== 'PENDIENTE').length
    const golesTotales = partidos.reduce((acc, p) => acc + (p.golesLocal || 0) + (p.golesVisitante || 0), 0)
    return [
      { label: 'Torneos activos', value: String(activos), trend: `${torneos.length} totales` },
      { label: 'Equipos inscritos', value: String(equiposCount), trend: selectedTorneo ? selectedTorneo.nombre : 'Selecciona torneo' },
      { label: 'Partidos jugados', value: String(jugados), trend: `${partidos.length} programados` },
      { label: 'Goles totales', value: String(golesTotales), trend: partidos.length ? `Promedio ${(golesTotales / partidos.length || 0).toFixed(1)}` : 'Sin partidos' },
    ]
  }, [torneos, tabla, partidos, selectedTorneo])

  const upcoming = useMemo(() => {
    return partidos
      .filter((p) => p.resultado === 'PENDIENTE')
      .sort((a, b) => (a.fechaProgramada || '').localeCompare(b.fechaProgramada || ''))
      .slice(0, 5)
  }, [partidos])


  if (!selectedTorneoId) {
    return <Alert variant="info">Por favor, selecciona un torneo para ver el dashboard.</Alert>
  }

  const isLoading = loadingPartidos || loadingTabla;

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h1>Dashboard</h1>
          <p className="text-muted">Resumen para el torneo: {selectedTorneo?.nombre}</p>
        </Col>
      </Row>

      {isLoading && <Spinner animation="border" />}
      
      <Row>
        {stats.map(s => (
          <Col md={3} key={s.label}>
            <StatCard title={s.label} value={s.value} trend={s.trend} />
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col md={8}>
          <Card>
            <Card.Header as="h5">PrÃ³ximos Partidos</Card.Header>
            <ListGroup variant="flush">
              {upcoming.length === 0 && <ListGroup.Item>No hay partidos pendientes.</ListGroup.Item>}
              {upcoming.map(p => (
                <ListGroup.Item key={p.id}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{equiposById.get(p.equipoLocalId) || '?'} vs {equiposById.get(p.equipoVisitanteId) || '?'}</strong>
                      <br />
                      <small className="text-muted">Jornada {p.jornada}</small>
                    </div>
                    <div className="text-end">
                      {p.fechaProgramada ? new Date(p.fechaProgramada).toLocaleString() : 'Sin fecha'}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header as="h5">Top 4</Card.Header>
            <Table striped responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Equipo</th>
                  <th>Pts</th>
                  <th>DG</th>
                </tr>
              </thead>
              <tbody>
                {tabla.slice(0, 4).map((t, i) => (
                  <tr key={t.equipoId}>
                    <td>{i + 1}</td>
                    <td>{t.nombreEquipo}</td>
                    <td>{t.puntos}</td>
                    <td>{t.diferenciaGoles}</td>
                  </tr>
                ))}
                {tabla.length === 0 && (
                  <tr><td colSpan="4" className="text-center">No hay datos.</td></tr>
                )}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}