const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

async function handleResponse(res) {
  if (!res.ok) {
    const errorText = await res.text()
    try {
      // Try to parse as JSON for structured errors from the API
      const errorJson = JSON.parse(errorText)
      throw new Error(errorJson.message || 'Error del servidor')
    } catch (e) {
      // Fallback to plain text if not JSON
      throw new Error(errorText || 'Error del servidor')
    }
  }
  // Handle 204 No Content
  if (res.status === 204) {
    return null
  }
  return res.json()
}

export async function apiGet(path) {
  const res = await fetch(`${API}${path}`)
  return handleResponse(res)
}

export async function apiPost(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  })
  return handleResponse(res)
}

export async function apiPut(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  })
  return handleResponse(res)
}
