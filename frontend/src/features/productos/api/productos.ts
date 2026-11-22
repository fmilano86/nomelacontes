import { api } from '@/shared/api/axiosInstance'
import type { Producto, ProductoDatos, ProductosPaginados, FiltrosProductos } from '@/features/productos/types'
export async function getProductos(filtros: FiltrosProductos) { return (await api.get<ProductosPaginados>('/productos', { params: filtros })).data }
export async function saveProducto({ id, datos }: { id?: number; datos: ProductoDatos }) { return (id === undefined ? await api.post<Producto>('/productos', datos) : await api.put<Producto>(`/productos/${id}`, datos)).data }
export async function deleteProducto(id: number) { await api.delete(`/productos/${id}`) }
export async function patchStock({ id, stock, disponible }: { id: number; stock: number; disponible: boolean }) { return (await api.patch<Producto>(`/productos/${id}/stock`, { stock, disponible })).data }
