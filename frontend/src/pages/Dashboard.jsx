import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Row,
  Col,
  Spinner,
  Alert,
  Card,
  Table,
  ListGroup,
} from 'react-bootstrap'
import {
  Trophy,
  People,
  Calendar2Check,
  LightningCharge
} from 'react-bootstrap-icons'
import { apiGet } from '../api'

function StatCard({ title, value, trend, icon: Icon, color }) {
  return (
    <Card className="h-100 border-0 shadow-sm overflow-hidden">
      <Card.Body className="position-relative">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="stat-card">
            <span className="stat-title">{title}</span>
            <h2 className="stat-value mb-0">{value}</h2>
          </div>
          <div className={`p-2 rounded-3 bg-${color} bg-opacity-10 text-${color}`}>
            <Icon size={20} />
          </div>
        </div>
        <div className="stat-trend trend-up">
          {trend}
        </div>
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
      { label: 'Torneos Activos', value: activos, trend: `${torneos.length} totales`, icon: Trophy, color: 'primary' },
      { label: 'Equipos', value: equiposCount, trend: 'En este torneo', icon: People, color: 'success' },
      { label: 'Partidos Jugados', value: jugados, trend: `${partidos.length} programados`, icon: Calendar2Check, color: 'info' },
      { label: 'Goles Marcados', value: golesTotales, trend: `Promedio ${(golesTotales / (jugados || 1)).toFixed(1)}/pj`, icon: LightningCharge, color: 'warning' },
    ]
  }, [torneos, tabla, partidos])

  const upcoming = useMemo(() => {
    return partidos
      .filter((p) => p.resultado === 'PENDIENTE')
      .sort((a, b) => (a.fechaProgramada || '').localeCompare(b.fechaProgramada || ''))
      .slice(0, 5)
  }, [partidos])

  if (!selectedTorneoId) {
    return (
      <div className="text-center py-5">
        <Trophy size={48} className="text-muted mb-3 opacity-25" />
        <h3 className="text-muted">No se ha seleccionado ningún torneo</h3>
        <p className="text-muted">Por favor, selecciona un torneo en la barra lateral para ver las estadísticas.</p>
      </div>
    )
  }

  const isLoading = loadingPartidos || loadingTabla

  return (
    <div className="container-fluid p-0">
      <header className="mb-4">
        <h1 className="display-6 fw-bold mb-1">Dashboard</h1>
        <p className="text-muted">Bienvenido al panel de control de <span className="text-primary fw-semibold">{selectedTorneo?.nombre}</span></p>
      </header>

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Row className="g-4 mb-4">
            {stats.map(s => (
              <Col lg={3} md={6} key={s.label}>
                <StatCard {...s} />
              </Col>
            ))}
          </Row>

          <Row className="g-4">
            <Col lg={8}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Header className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">Próximos Partidos</h5>
                  <span className="badge bg-primary-light text-primary-accent rounded-pill px-3">En vivo</span>
                </Card.Header>
                <Card.Body className="p-0">
                  <ListGroup variant="flush">
                    {upcoming.length === 0 && (
                      <div className="text-center py-5 text-muted">
                        <Calendar2Check size={32} className="mb-2 opacity-25" />
                        <p>No hay partidos programados próximamente.</p>
                      </div>
                    )}
                    {upcoming.map(p => (
                      <ListGroup.Item key={p.id} className="px-4 py-3 border-light">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-4">
                            <div className="text-center" style={{ minWidth: '100px' }}>
                              <small className="text-uppercase text-muted d-block fw-bold" style={{ fontSize: '0.65rem' }}>Local</small>
                              <span className="fw-semibold">{equiposById.get(p.equipoLocalId) || '?'}</span>
                            </div>
                            <div className="bg-light px-3 py-1 rounded-pill fw-bold text-muted small">VS</div>
                            <div className="text-center" style={{ minWidth: '100px' }}>
                              <small className="text-uppercase text-muted d-block fw-bold" style={{ fontSize: '0.65rem' }}>Visitante</small>
                              <span className="fw-semibold">{equiposById.get(p.equipoVisitanteId) || '?'}</span>
                            </div>
                          </div>
                          <div className="text-end">
                            <p className="mb-0 fw-bold text-primary" style={{ fontSize: '0.9rem' }}>
                              {p.fechaProgramada ? new Date(p.fechaProgramada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                            </p>
                            <small className="text-muted">
                              {p.fechaProgramada ? new Date(p.fechaProgramada).toLocaleDateString() : 'Sin fecha'}
                            </small>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Header className="bg-white border-0 py-3">
                  <h5 className="mb-0 fw-bold">Top Clasificación</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table borderless hover className="mb-0 align-middle">
                    <thead className="bg-light">
                      <tr>
                        <th className="ps-4 py-2 small text-muted text-uppercase">Pos</th>
                        <th className="py-2 small text-muted text-uppercase">Equipo</th>
                        <th className="py-2 small text-muted text-uppercase text-center">Pts</th>
                        <th className="pe-4 py-2 small text-muted text-uppercase text-center">DG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tabla.slice(0, 5).map((t, i) => (
                        <tr key={t.equipoId}>
                          <td className="ps-4">
                            <span className={`badge rounded-circle p-2 ${i < 3 ? 'bg-primary-accent' : 'bg-secondary text-white'}`} style={{ width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                              {i + 1}
                            </span>
                          </td>
                          <td className="fw-semibold">{t.nombreEquipo}</td>
                          <td className="text-center fw-bold text-primary">{t.puntos}</td>
                          <td className="pe-4 text-center">
                            <span className={`small fw-bold ${t.diferenciaGoles >= 0 ? 'text-success' : 'text-danger'}`}>
                              {t.diferenciaGoles > 0 ? `+${t.diferenciaGoles}` : t.diferenciaGoles}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {tabla.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center py-5 text-muted">No hay datos disponibles.</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  {tabla.length > 5 && (
                    <div className="p-3 text-center border-top">
                      <a href="/tabla" className="text-primary-accent fw-bold small">Ver tabla completa</a>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  )
}