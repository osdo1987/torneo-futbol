import { useState } from 'react'

export default function TorneosPage({
  torneos,
  selectedTorneoId,
  onSelectTorneo,
  torneoForm,
  setTorneoForm,
  onCrearTorneo,
  onActualizarTorneo,
  onAccionTorneo,
  modalState,
  setModalState,
}) {
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({
    nombre: '',
    maxJugadoresPorEquipo: 1,
    puntosVictoria: 3,
    puntosEmpate: 1,
    puntosDerrota: 0,
  })

  function startEdit(torneo) {
    setEditId(torneo.id)
    setEditForm({
      nombre: torneo.nombre,
      maxJugadoresPorEquipo: torneo.maxJugadoresPorEquipo,
      puntosVictoria: torneo.puntosVictoria ?? 3,
      puntosEmpate: torneo.puntosEmpate ?? 1,
      puntosDerrota: torneo.puntosDerrota ?? 0,
    })
  }

  function cancelEdit() {
    setEditId(null)
  }

  function saveEdit(e) {
    e.preventDefault()
    onActualizarTorneo(editId, editForm)
    setEditId(null)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Gestión</div>
          <h1>Torneos</h1>
        </div>
        <button className="btn" onClick={() => setModalState({ open: true, mode: 'create' })}>
          Crear torneo
        </button>
      </div>

      <div className="cards grid">
        {torneos.map((t) => {
          const puedeAbrir = t.estado === 'CREADO' || t.estado === 'INSCRIPCIONES_CERRADAS'
          const puedeCerrar = t.estado === 'INSCRIPCIONES_ABIERTAS'
          const puedeSorteo = t.estado === 'INSCRIPCIONES_CERRADAS'
          const puedeFinalizar = t.estado === 'EN_JUEGO'

          return (
            <div key={t.id} className={`card torneo-card ${selectedTorneoId === t.id ? 'active-row' : ''}`}>
              <div className="card-header">
                <div>
                  <h2>{t.nombre}</h2>
                  <div className={`status ${t.estado.toLowerCase()}`}>{formatEstado(t.estado)}</div>
                </div>
                <div className="card-actions">
                  <button className="btn ghost" onClick={() => onSelectTorneo(t.id)}>Seleccionar</button>
                  {t.estado === 'CREADO' && editId !== t.id && (
                    <button className="btn ghost" onClick={() => startEdit(t)}>Editar</button>
                  )}
                </div>
              </div>

              <div className="torneo-info">
                <div><span>Máx. jugadores:</span> {t.maxJugadoresPorEquipo}</div>
                <div><span>Estado actual:</span> {formatEstado(t.estado)}</div>
              </div>

              {editId === t.id && (
                <form onSubmit={saveEdit} className="form inline">
                  <label className="form-label">Nombre del torneo</label>
                  <input
                    value={editForm.nombre}
                    onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                  />
                  <label className="form-label">Máx. jugadores por equipo</label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.maxJugadoresPorEquipo}
                    onChange={(e) => setEditForm({ ...editForm, maxJugadoresPorEquipo: Number(e.target.value) })}
                  />
                  <label className="form-label">Puntuación</label>
                  <div className="row">
                    <input
                      type="number"
                      min="0"
                      value={editForm.puntosVictoria}
                      onChange={(e) => setEditForm({ ...editForm, puntosVictoria: Number(e.target.value) })}
                      placeholder="Victoria"
                    />
                    <input
                      type="number"
                      min="0"
                      value={editForm.puntosEmpate}
                      onChange={(e) => setEditForm({ ...editForm, puntosEmpate: Number(e.target.value) })}
                      placeholder="Empate"
                    />
                    <input
                      type="number"
                      min="0"
                      value={editForm.puntosDerrota}
                      onChange={(e) => setEditForm({ ...editForm, puntosDerrota: Number(e.target.value) })}
                      placeholder="Derrota"
                    />
                  </div>
                  <div className="row">
                    <button className="btn block" type="submit">Guardar</button>
                    <button className="btn ghost block" type="button" onClick={cancelEdit}>Cancelar</button>
                  </div>
                </form>
              )}

              <div className="actions actions-grid">
                <button
                  className="btn"
                  disabled={!puedeAbrir}
                  onClick={() => onAccionTorneo(t.id, 'inscripciones/abrir', puedeAbrir ? 'Inscripciones abiertas' : '')}
                >
                  {t.estado === 'INSCRIPCIONES_CERRADAS' ? 'Reabrir inscripciones' : 'Abrir inscripciones'}
                </button>
                <button
                  className="btn secondary"
                  disabled={!puedeCerrar}
                  onClick={() => onAccionTorneo(t.id, 'inscripciones/cerrar', puedeCerrar ? 'Inscripciones cerradas' : '')}
                >
                  Cerrar inscripciones
                </button>
                <button
                  className="btn ghost"
                  disabled={!puedeSorteo}
                  onClick={() => onAccionTorneo(t.id, 'sorteo', puedeSorteo ? 'Sorteo generado' : '')}
                >
                  Generar sorteo
                </button>
                <button
                  className="btn ghost"
                  disabled={!puedeFinalizar}
                  onClick={() => onAccionTorneo(t.id, 'finalizar', puedeFinalizar ? 'Torneo finalizado' : '')}
                >
                  Finalizar torneo
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {modalState.open && (
        <div className="modal-overlay" onClick={() => setModalState({ open: false, mode: 'create' })}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Crear torneo</h2>
              <button className="btn ghost" onClick={() => setModalState({ open: false, mode: 'create' })}>X</button>
            </div>

            <form onSubmit={onCrearTorneo} className="form">
              <label className="form-label">Nombre del torneo</label>
              <input
                placeholder="Ej: Torneo Apertura"
                value={torneoForm.nombre}
                onChange={(e) => setTorneoForm({ ...torneoForm, nombre: e.target.value })}
              />

              <label className="form-label">Máx. jugadores por equipo</label>
              <input
                type="number"
                min="1"
                value={torneoForm.maxJugadoresPorEquipo}
                onChange={(e) => setTorneoForm({ ...torneoForm, maxJugadoresPorEquipo: Number(e.target.value) })}
                placeholder="Ej: 15"
              />

              <label className="form-label">Puntuación</label>
              <div className="row">
                <input
                  type="number"
                  min="0"
                  value={torneoForm.puntosVictoria}
                  onChange={(e) => setTorneoForm({ ...torneoForm, puntosVictoria: Number(e.target.value) })}
                  placeholder="Victoria"
                />
                <input
                  type="number"
                  min="0"
                  value={torneoForm.puntosEmpate}
                  onChange={(e) => setTorneoForm({ ...torneoForm, puntosEmpate: Number(e.target.value) })}
                  placeholder="Empate"
                />
                <input
                  type="number"
                  min="0"
                  value={torneoForm.puntosDerrota}
                  onChange={(e) => setTorneoForm({ ...torneoForm, puntosDerrota: Number(e.target.value) })}
                  placeholder="Derrota"
                />
              </div>

              <button className="btn block" type="submit">
                Crear torneo
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function formatEstado(estado) {
  switch (estado) {
    case 'CREADO':
      return 'Creado'
    case 'INSCRIPCIONES_ABIERTAS':
      return 'Inscripciones abiertas'
    case 'INSCRIPCIONES_CERRADAS':
      return 'Inscripciones cerradas'
    case 'SORTEADO':
      return 'Sorteado'
    case 'EN_JUEGO':
      return 'En juego'
    case 'FINALIZADO':
      return 'Finalizado'
    default:
      return estado
  }
}
