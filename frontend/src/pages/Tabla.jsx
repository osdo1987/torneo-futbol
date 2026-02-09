import { useQuery } from '@tanstack/react-query'
import {
  Spinner,
  Alert,
  Table,
  Card,
  Badge,
} from 'react-bootstrap'
import { TrophyFill, Table as TableIcon } from 'react-bootstrap-icons'
import { apiGet } from '../api'

export default function TablaPage({ selectedTorneoId }) {
  const { data: tabla = [], isLoading, isError, error } = useQuery({
    queryKey: ['tabla', selectedTorneoId],
    queryFn: () => apiGet(`/torneos/${selectedTorneoId}/tabla`),
    enabled: !!selectedTorneoId,
  })

  if (!selectedTorneoId) {
    return (
      <div className="text-center py-5">
        <TableIcon size={48} className="text-muted mb-3 opacity-25" />
        <h3 className="text-muted">Clasificación No Disponible</h3>
        <p className="text-muted">Selecciona un torneo para consultar el estado de la competición.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="danger" className="border-0 shadow-sm">
        <Alert.Heading>Error de Sistema</Alert.Heading>
        <p>{error.message}</p>
      </Alert>
    )
  }

  return (
    <div className="container-fluid p-0 fade-in">
      <header className="mb-5">
        <h1 className="display-6 fw-bold mb-1">Tabla de Posiciones</h1>
        <p className="text-muted">Ranking oficial y estadísticas de rendimiento por equipo</p>
      </header>

      <Card className="border-0 shadow-sm overflow-hidden">
        <Card.Header className="bg-white border-0 py-3 px-4 d-flex align-items-center gap-2">
          <TrophyFill className="text-primary" />
          <h5 className="mb-0 fw-bold">Clasificación General</h5>
        </Card.Header>

        <Table hover responsive className="align-middle mb-0">
          <thead className="bg-light">
            <tr>
              <th className="ps-4 py-3 small text-muted text-uppercase">Pos.</th>
              <th className="py-3 small text-muted text-uppercase">Delegación</th>
              <th className="py-3 small text-muted text-uppercase text-center">PJ</th>
              <th className="py-3 small text-muted text-uppercase text-center text-success">PG</th>
              <th className="py-3 small text-muted text-uppercase text-center text-warning">PE</th>
              <th className="py-3 small text-muted text-uppercase text-center text-danger">PP</th>
              <th className="py-3 small text-muted text-uppercase text-center">GF</th>
              <th className="py-3 small text-muted text-uppercase text-center">GC</th>
              <th className="py-3 small text-muted text-uppercase text-center">DG</th>
              <th className="pe-4 py-3 small text-muted text-uppercase text-center">Pts</th>
            </tr>
          </thead>
          <tbody>
            {tabla.map((t, index) => (
              <tr key={t.equipoId} className={index < 4 ? 'bg-primary bg-opacity-10 bg-hover-transparent' : ''}>
                <td className="ps-4 py-3">
                  <div className={`fw-bold d-flex align-items-center justify-content-center rounded-circle ${index < 4 ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>
                    {index + 1}
                  </div>
                </td>
                <td className="py-3">
                  <div className="fw-bold">{t.nombreEquipo}</div>
                  {index < 4 && <small className="text-primary fw-bold" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Zona de Playoffs</small>}
                </td>
                <td className="py-3 text-center fw-semibold text-muted">{t.partidosJugados}</td>
                <td className="py-3 text-center fw-semibold">{t.partidosGanados}</td>
                <td className="py-3 text-center fw-semibold">{t.partidosEmpatados}</td>
                <td className="py-3 text-center fw-semibold">{t.partidosPerdidos}</td>
                <td className="py-3 text-center text-muted small">{t.golesFavor}</td>
                <td className="py-3 text-center text-muted small">{t.golesContra}</td>
                <td className="py-3 text-center">
                  <span className={`fw-bold ${t.diferenciaGoles >= 0 ? 'text-success' : 'text-danger'}`}>
                    {t.diferenciaGoles > 0 ? `+${t.diferenciaGoles}` : t.diferenciaGoles}
                  </span>
                </td>
                <td className="pe-4 py-3 text-center">
                  <div className="h5 mb-0 fw-bold text-primary">{t.puntos}</div>
                </td>
              </tr>
            ))}
            {tabla.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center py-5">
                  <TableIcon size={32} className="text-muted opacity-25 mb-2" />
                  <p className="text-muted mb-0">No se registran datos estadísticos para este torneo.</p>
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <Card.Footer className="bg-white border-0 py-3 px-4">
          <div className="d-flex align-items-center gap-4">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary rounded-circle" style={{ width: '12px', height: '12px' }}></div>
              <small className="text-muted">Zona de Clasificación</small>
            </div>
            <small className="text-muted italic">Actualizado en tiempo real según actas oficiales.</small>
          </div>
        </Card.Footer>
      </Card>
    </div>
  )
}