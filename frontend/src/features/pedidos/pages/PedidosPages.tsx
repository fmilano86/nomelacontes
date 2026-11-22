import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { Pedido, EstadoPedido } from '@/features/pedidos/types'
import { usePedidos, usePedidoMutations } from '@/features/pedidos/hooks/usePedidos'
import { DetallePedido } from '@/features/pedidos/components/DetallePedido'
import { DataTable } from '@/shared/components/DataTable'
import { Modal } from '@/shared/components/Modal'
import { BadgeEstado } from '@/shared/ui/BadgeEstado'
import { Skeleton, EstadoError, Paginacion } from '@/shared/components/ListaEstados'
import { useAuthStore } from '@/store/authStore'
import { dinero, fecha } from '@/shared/format'
const estados: EstadoPedido[] = ['PENDIENTE', 'EN_PREPARACION', 'ENTREGADO', 'CANCELADO']
export function MisPedidosPage() { return <PedidosPage admin={false} /> }
export function AdminPedidosPage() { return <PedidosPage admin /> }
function PedidosPage({ admin }: { admin: boolean }) {
  const [pagina, setPagina] = useState(0), [estado, setEstado] = useState<EstadoPedido | ''>(''), [detalle, setDetalle] = useState<number | null>(null), [mensaje, setMensaje] = useState('')
  const usuario = useAuthStore(s => s.usuario)
  const pedidos = usePedidos(pagina * 20, estado || undefined), { cancelar, cambiar } = usePedidoMutations()
  const ocupado = cancelar.isPending || cambiar.isPending
  // El backend devuelve todos al admin; en Mis pedidos se muestran sus pedidos propios.
  const items = admin ? pedidos.data?.items ?? [] : (pedidos.data?.items ?? []).filter(p => p.usuario_id === usuario?.id)
  const columns: ColumnDef<Pedido>[] = [
    { accessorKey: 'id', header: 'Pedido' }, { accessorKey: 'created_at', header: 'Fecha', cell: x => fecha(String(x.getValue())) },
    { accessorKey: 'usuario_id', header: 'Cliente' }, { accessorKey: 'total', header: 'Total', cell: x => dinero(Number(x.getValue())) },
    { accessorKey: 'estado', header: 'Estado', cell: ({ row }) => <BadgeEstado estado={row.original.estado} /> },
    { id: 'acciones', header: 'Acciones', cell: ({ row }) => {
      const p = row.original
      return <div className="flex flex-wrap gap-2"><button className="btn-secondary" onClick={() => setDetalle(p.id)}>Detalle</button>{admin && (p.estado === 'PENDIENTE' || p.estado === 'EN_PREPARACION') && <button className="btn-primary" disabled={ocupado} onClick={() => cambiar.mutate({ id: p.id, estado: p.estado === 'PENDIENTE' ? 'EN_PREPARACION' : 'ENTREGADO' }, { onSuccess: () => setMensaje('Estado actualizado.') })}>{p.estado === 'PENDIENTE' ? 'Preparar' : 'Entregar'}</button>}{(p.estado === 'PENDIENTE' || (admin && p.estado === 'EN_PREPARACION')) && <button className="btn-danger" disabled={ocupado} onClick={() => { if (!window.confirm(`¿Cancelar el pedido ${p.id} y restituir su stock?`)) return; if (admin) cambiar.mutate({ id: p.id, estado: 'CANCELADO' }, { onSuccess: () => setMensaje('Pedido cancelado. Stock restituido.') }); else cancelar.mutate(p.id, { onSuccess: () => setMensaje('Pedido cancelado. Stock restituido.') }) }}>Cancelar</button>}</div>
    } },
  ]
  return <section><h1 className="mb-6 text-3xl font-bold">{admin ? 'Gestión de pedidos' : 'Mis pedidos'}</h1><label className="mb-5 block max-w-xs">Filtrar por estado<select className="campo" value={estado} onChange={e => { const valor = e.target.value; setEstado(estados.find(x => x === valor) ?? ''); setPagina(0) }}><option value="">Todos</option>{estados.map(x => <option key={x} value={x}>{x.replaceAll('_', ' ')}</option>)}</select></label>{mensaje && <p role="status" className="my-4">{mensaje}</p>}{pedidos.isPending && <Skeleton />}{pedidos.isError && <EstadoError error={pedidos.error} />}{cancelar.isError && <EstadoError error={cancelar.error} />}{cambiar.isError && <EstadoError error={cambiar.error} />}{pedidos.data && <><DataTable data={items} columns={columns} /><Paginacion pagina={pagina} total={pedidos.data.total} limite={20} cambiar={setPagina} /></>}<Modal abierto={detalle !== null} titulo={`Pedido ${detalle ?? ''}`} ocupado={false} onCerrar={() => setDetalle(null)}>{detalle !== null && <DetallePedido id={detalle} />}</Modal></section>
}
