import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPedidos, getPedido, postPedido, cancelarPedido, cambiarEstado, getResumen } from '@/features/pedidos/api/pedidos'
import type { EstadoPedido } from '@/features/pedidos/types'
export function usePedidos(skip: number, estado?: EstadoPedido) { return useQuery({ queryKey: ['pedidos', skip, estado], queryFn: () => getPedidos(skip, estado) }) }
export function usePedido(id: number | null) { return useQuery({ queryKey: ['pedido', id], enabled: id !== null, queryFn: () => getPedido(id!) }) }
export function useResumenPedidos() { return useQuery({ queryKey: ['resumen'], queryFn: getResumen }) }
export function usePedidoMutations() {
  const client = useQueryClient()
  async function actualizar() { await Promise.all(['pedidos', 'pedido', 'productos', 'resumen'].map(key => client.invalidateQueries({ queryKey: [key] }))) }
  const crear = useMutation({ mutationFn: postPedido, onSuccess: actualizar })
  const cancelar = useMutation({ mutationFn: cancelarPedido, onSuccess: actualizar })
  const cambiar = useMutation({ mutationFn: cambiarEstado, onSuccess: actualizar })
  return { crear, cancelar, cambiar }
}
