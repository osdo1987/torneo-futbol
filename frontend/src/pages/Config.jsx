import { Card, Badge, Alert, Col, Row } from 'react-bootstrap'
import { GearFill, Server, Globe, ShieldLockFill, InfoCircleFill } from 'react-bootstrap-icons'

export default function ConfigPage({ apiUrl }) {
    return (
        <div className="container-fluid p-0 fade-in">
            <header className="mb-5">
                <h1 className="display-6 fw-bold mb-1">Configuración del Sistema</h1>
                <p className="text-muted">Parámetros técnicos y estado de la infraestructura</p>
            </header>

            <Row className="g-4">
                <Col lg={8}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-white border-0 py-3 px-4 d-flex align-items-center gap-2">
                            <Server className="text-primary" />
                            <h5 className="mb-0 fw-bold">Conectividad y Backend</h5>
                        </Card.Header>
                        <Card.Body className="px-4 pb-4">
                            <div className="bg-light p-4 rounded-4 mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="small fw-bold text-muted text-uppercase">URL del Punto de Enlace (API)</div>
                                    <Badge bg="success" className="px-3 py-2">Operacional</Badge>
                                </div>
                                <div className="p-3 bg-white rounded-3 border d-flex align-items-center gap-3">
                                    <div className="p-2 bg-primary bg-opacity-10 rounded">
                                        <Globe size={18} className="text-primary" />
                                    </div>
                                    <code className="text-primary fw-bold">{apiUrl}</code>
                                </div>
                            </div>

                            <Alert variant="info" className="border-0 shadow-sm d-flex gap-3 align-items-start">
                                <InfoCircleFill size={20} className="mt-1" />
                                <div>
                                    <h6 className="fw-bold mb-1">Nota de entorno</h6>
                                    <p className="mb-0 small">
                                        Para modificar la dirección del servidor API, actualice la variable <code>VITE_API_URL</code>
                                        en su archivo de configuración <code>.env</code> y reinicie el servidor de desarrollo.
                                    </p>
                                </div>
                            </Alert>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm overflow-hidden">
                        <div className="p-4 bg-primary text-white d-flex align-items-center gap-3">
                            <ShieldLockFill size={24} />
                            <div>
                                <h5 className="mb-0 fw-bold">Seguridad del Sistema</h5>
                                <small className="text-white text-opacity-75">Protocolos de acceso y protección de datos</small>
                            </div>
                        </div>
                        <Card.Body className="px-4 py-4">
                            <div className="d-flex align-items-center justify-content-between mb-0">
                                <div>
                                    <h6 className="fw-bold mb-0">Estado de Encriptación</h6>
                                    <small className="text-muted">Certificados TLS/SSL gestionados por el servidor corporativo</small>
                                </div>
                                <div className="text-success fw-bold d-flex align-items-center gap-2">
                                    <div className="bg-success rounded-circle" style={{ width: 10, height: 10 }}></div>
                                    Activado
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white border-0 py-3 px-4">
                            <h5 className="mb-0 fw-bold">Versión y Soporte</h5>
                        </Card.Header>
                        <Card.Body className="px-4 flex-grow-1">
                            <div className="text-center py-4 border-bottom mb-4">
                                <div className="bg-light p-3 rounded-circle d-inline-flex mb-3">
                                    <GearFill size={32} className="text-primary" />
                                </div>
                                <h6 className="fw-bold">Torneo Pro Manager</h6>
                                <p className="text-muted small">v2.0.4 - Release Stable</p>
                            </div>

                            <ul className="list-unstyled mb-0">
                                <li className="d-flex justify-content-between mb-3">
                                    <span className="text-muted small">Dependencias:</span>
                                    <span className="badge bg-light text-dark">Vite/React</span>
                                </li>
                                <li className="d-flex justify-content-between mb-3">
                                    <span className="text-muted small">Protocolo:</span>
                                    <span className="badge bg-light text-dark">REST API</span>
                                </li>
                                <li className="d-flex justify-content-between">
                                    <span className="text-muted small">Compilación:</span>
                                    <span className="badge bg-light text-dark">Production</span>
                                </li>
                            </ul>
                        </Card.Body>
                        <Card.Footer className="bg-light border-0 py-3 text-center">
                            <small className="text-muted">© 2026 Osdosoft Corporate. Todos los derechos reservados.</small>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
