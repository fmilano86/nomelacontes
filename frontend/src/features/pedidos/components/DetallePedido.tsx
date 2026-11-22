import { usePedido } from '@/features/pedidos/hooks/usePedidos'
import { Skeleton, EstadoError } from '@/shared/components/ListaEstados'
import { BadgeEstado } from '@/shared/ui/BadgeEstado'
import { dinero, fecha } from '@/shared/format'
export function DetallePedido({ id }: { id: number }) {
  const pedido = usePedido(id)
  if (pedido.isPending) return <Skeleton />
  if (pedido.isError) return <EstadoError error={pedido.error} />
  const p = pedido.data
  return <div className="space-y-4"><BadgeEstado estado={p.estado} /><p>Fecha: {fecha(p.created_at)}</p><p>Dirección: {p.direccion_entrega}</p><p>Pago: {p.forma_pago}</p>{p.notas && <p>Notas: {p.notas}</p>}<ul className="space-y-2">{p.items.map(x => <li key={x.producto_id}>{x.cantidad} × {x.nombre_producto} · {dinero(x.precio_unitario)} = {dinero(x.subtotal)}</li>)}</ul><strong>Total: {dinero(p.total)}</strong></div>
}
