import type { EstadoPedido } from '@/features/pedidos/types'
const colores: Record<EstadoPedido, string> = { PENDIENTE: 'bg-yellow-100 text-yellow-950', EN_PREPARACION: 'bg-blue-100 text-blue-950', ENTREGADO: 'bg-green-100 text-green-950', CANCELADO: 'bg-red-100 text-red-950' }
export function BadgeEstado({ estado }: { estado: EstadoPedido }) { return <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${colores[estado]}`}>{estado.replaceAll('_', ' ')}</span> }
