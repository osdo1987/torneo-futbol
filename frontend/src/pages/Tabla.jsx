import { useQuery } from '@tanstack/react-query'
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Table,
  Card,
} from 'react-bootstrap'
import { apiGet } from '../api'

export default function TablaPage({ selectedTorneoId }) {
  const { data: tabla = [], isLoading, isError, error } = useQuery({
    queryKey: ['tabla', selectedTorneoId],
    queryFn: () => apiGet(`/torneos/${selectedTorneoId}/tabla`),
    enabled: !!selectedTorneoId,
  })

  if (!selectedTorneoId) {
    return <Alert variant="info">Por favor, selecciona un torneo para ver la tabla de posiciones.</Alert>
  }

  if (isLoading) {
    return <Spinner animation="border" />
  }

  if (isError) {
    return <Alert variant="danger">Error al cargar la tabla: {error.message}</Alert>
  }

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h1>Tabla de Posiciones</h1>
        </Col>
      </Row>
      <Card>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Equipo</th>
              <th>PJ</th>
              <th>PG</th>
              <th>PE</th>
              <th>PP</th>
              <th>GF</th>
              <th>GC</th>
              <th>DG</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {tabla.map((t, index) => (
              <tr key={t.equipoId}>
                <td>{index + 1}</td>
                <td>{t.nombreEquipo}</td>
                <td>{t.partidosJugados}</td>
                <td>{t.partidosGanados}</td>
                <td>{t.partidosEmpatados}</td>
                <td>{t.partidosPerdidos}</td>
                <td>{t.golesFavor}</td>
                <td>{t.golesContra}</td>
                <td>{t.diferenciaGoles}</td>
                <td><strong>{t.puntos}</strong></td>
              </tr>
            ))}
            {tabla.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center">Aún no hay datos para la tabla de posiciones.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </Container>
  )
}