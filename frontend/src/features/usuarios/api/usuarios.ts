import { api } from '@/shared/api/axiosInstance'
import type { Usuario } from '@/features/auth'
export async function getUsuarios() { return (await api.get<Usuario[]>('/admin/usuarios')).data }
export async function cambiarUsuario({ id, activar }: { id: number; activar: boolean }) { return (await api.post<Usuario>(`/admin/usuarios/${id}/${activar ? 'activar' : 'desactivar'}`)).data }
