import { api } from '@/shared/api/axiosInstance'
import type { Pedido, PedidoCreate, PedidosPaginados, EstadoPedido, ResumenPedidos } from '@/features/pedidos/types'
export async function getPedidos(skip: number, estado?: EstadoPedido) { return (await api.get<PedidosPaginados>('/pedidos', { params: { skip, limit: 20, estado } })).data }
export async function getPedido(id: number) { return (await api.get<Pedido>(`/pedidos/${id}`)).data }
export async function postPedido(datos: PedidoCreate) { return (await api.post<Pedido>('/pedidos', datos)).data }
export async function cancelarPedido(id: number) { return (await api.patch<Pedido>(`/pedidos/${id}/cancelar`)).data }
export async function cambiarEstado({ id, estado }: { id: number; estado: EstadoPedido }) { return (await api.patch<Pedido>(`/pedidos/${id}/estado`, { estado })).data }
export async function getResumen() { return (await api.get<ResumenPedidos>('/pedidos/resumen')).data }
