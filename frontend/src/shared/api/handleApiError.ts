import axios from 'axios'
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError<{ detail?: unknown }>(error)) {
    if (!error.response) return 'No se pudo conectar con el servidor. Verificá que el backend esté iniciado.'
    const detail = error.response.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) return 'Revisá los datos del formulario: hay valores inválidos.'
    return `No se pudo completar la operación (${error.response.status}).`
  }
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
}
