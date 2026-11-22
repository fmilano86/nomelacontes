import { api } from '@/shared/api/axiosInstance'
import type { Usuario, Registro, Login } from '@/features/auth/types'
export async function loginRequest(datos: Login) {
  const form = new URLSearchParams({ username: datos.username, password: datos.password })
  await api.post('/auth/token', form)
}
export async function meRequest() { return (await api.get<Usuario>('/auth/me')).data }
export async function logoutRequest() { await api.post('/auth/logout') }
export async function registerRequest(datos: Registro) { return (await api.post<Usuario>('/auth/register', datos)).data }
