import { useState } from 'react'

export default function EquiposPage({
  equipos,
  jugadores,
  selectedEquipoId,
  onSelectEquipo,
  equipoForm,
  setEquipoForm,
  onInscribirEquipo,
  jugadorForm,
  setJugadorForm,
  onInscribirJugador,
}) {
  const [modalEquipo, setModalEquipo] = useState(false)

  const equipoSeleccionado = equipos.find((e) => e.id === selectedEquipoId)

  function handleCrearEquipo(e) {
    onInscribirEquipo(e)
    setModalEquipo(false)
  }

  function handleCrearJugador(e) {
    onInscribirJugador(e)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Gestión</div>
          <h1>Equipos</h1>
          <div className="muted">Crea equipos y agrega jugadores al equipo seleccionado.</div>
        </div>
        <button className="btn" onClick={() => setModalEquipo(true)}>
          Crear equipo
        </button>
      </div>

      <div className="split">
        <div className="card">
          <div className="card-header">
            <h2>Equipos inscritos</h2>
          </div>
          <div className="simple-list">
            {equipos.length === 0 && (
              <div className="empty">
                <div className="empty-title">No hay equipos aún</div>
                <div className="muted">Crea el primer equipo para comenzar.</div>
                <button className="btn" onClick={() => setModalEquipo(true)}>Crear equipo</button>
              </div>
            )}
            {equipos.map((e) => (
              <div key={e.id} className={`simple-row ${selectedEquipoId === e.id ? 'active-row' : ''}`}>
                <div>
                  <div className="strong">{e.nombre}</div>
                  <div className="muted">Delegado: {e.delegadoEmail}</div>
                </div>
                <button className="btn ghost" onClick={() => onSelectEquipo(e.id)}>
                  {selectedEquipoId === e.id ? 'Seleccionado' : 'Seleccionar'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2>Jugadores</h2>
              <div className="muted">
                {equipoSeleccionado
                  ? `Equipo: ${equipoSeleccionado.nombre}`
                  : 'Selecciona un equipo para ver y agregar jugadores'}
              </div>
            </div>
          </div>

          {equipoSeleccionado ? (
            <>
              <div className="section">
                <div className="section-title">Agregar jugador</div>
                <form onSubmit={handleCrearJugador} className="form compact">
                  <label className="form-label">Nombre del jugador</label>
                  <input
                    placeholder="Ej: Juan Pérez"
                    value={jugadorForm.nombre}
                    onChange={(e) => setJugadorForm({ ...jugadorForm, nombre: e.target.value })}
                  />
                  <label className="form-label">Número de camiseta</label>
                  <input
                    type="number"
                    min="1"
                    value={jugadorForm.numeroCamiseta}
                    onChange={(e) => setJugadorForm({ ...jugadorForm, numeroCamiseta: Number(e.target.value) })}
                    placeholder="Ej: 10"
                  />
                  <button className="btn block" type="submit">Agregar jugador</button>
                </form>
              </div>

              <div className="section">
                <div className="section-title">Lista de jugadores</div>
                <div className="simple-list">
                  {jugadores.length === 0 && <div className="muted">Este equipo no tiene jugadores.</div>}
                  {jugadores.map((j) => (
                    <div key={j.id} className="simple-row">
                      <span>{j.nombre}</span>
                      <span className="muted">#{j.numeroCamiseta}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="empty">
              <div className="empty-title">Selecciona un equipo</div>
              <div className="muted">Luego podrás registrar jugadores aquí.</div>
            </div>
          )}
        </div>
      </div>

      {modalEquipo && (
        <div className="modal-overlay" onClick={() => setModalEquipo(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Crear equipo</h2>
              <button className="btn ghost" onClick={() => setModalEquipo(false)}>X</button>
            </div>
            <form onSubmit={handleCrearEquipo} className="form">
              <label className="form-label">Nombre del equipo</label>
              <input
                placeholder="Ej: Leones FC"
                value={equipoForm.nombre}
                onChange={(e) => setEquipoForm({ ...equipoForm, nombre: e.target.value })}
              />
              <label className="form-label">Email del delegado</label>
              <input
                placeholder="delegado@equipo.com"
                value={equipoForm.delegadoEmail}
                onChange={(e) => setEquipoForm({ ...equipoForm, delegadoEmail: e.target.value })}
              />
              <button className="btn block" type="submit">Guardar equipo</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
