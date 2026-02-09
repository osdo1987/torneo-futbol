import { useState } from 'react'
import { Form, Button, Card, Container, Alert } from 'react-bootstrap'
import { ShieldLockFill } from 'react-bootstrap-icons'
import { apiPost } from '../api'

export default function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const user = await apiPost('/auth/login', { username, password })
            onLogin(user)
        } catch (err) {
            setError('Credenciales inválidas')
        }
    }

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <Card className="border-0 shadow-lg p-4" style={{ width: '400px', borderRadius: '20px' }}>
                <div className="text-center mb-4">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex p-3 mb-3">
                        <ShieldLockFill size={32} />
                    </div>
                    <h2 className="fw-bold">Bienvenido</h2>
                    <p className="text-muted">Ingresa tus credenciales para continuar</p>
                </div>

                {error && <Alert variant="danger" className="py-2 small border-0">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-muted">Usuario</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="admin"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="bg-light border-0 py-2 ps-3 shadow-none"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label className="small fw-bold text-muted">Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="admin123"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="bg-light border-0 py-2 ps-3 shadow-none"
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 py-2 fw-bold rounded-pill">
                        Iniciar Sesión
                    </Button>
                </Form>
            </Card>
        </Container>
    )
}
