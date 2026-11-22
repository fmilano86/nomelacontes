import { api } from '@/shared/api/axiosInstance'
import type { Categoria, CategoriaDatos } from '@/features/categorias/types'
export async function getCategorias() { return (await api.get<Categoria[]>('/categorias')).data }
export async function saveCategoria({ id, datos }: { id?: number; datos: CategoriaDatos }) { return (id === undefined ? await api.post<Categoria>('/categorias', datos) : await api.put<Categoria>(`/categorias/${id}`, datos)).data }
export async function deleteCategoria(id: number) { await api.delete(`/categorias/${id}`) }
