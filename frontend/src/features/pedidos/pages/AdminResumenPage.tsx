import { useResumenPedidos } from '@/features/pedidos/hooks/usePedidos'
import { Skeleton, EstadoError } from '@/shared/components/ListaEstados'
import { dinero } from '@/shared/format'
export function AdminResumenPage() {
  const resumen = useResumenPedidos()
  if (resumen.isPending) return <Skeleton />
  if (resumen.isError) return <EstadoError error={resumen.error} />
  const r = resumen.data
  const indicadores = [['Pendientes', r.pendientes], ['En preparación', r.en_preparacion], ['Entregados', r.entregados], ['Cancelados', r.cancelados], ['Pedidos de hoy (UTC)', r.pedidos_hoy], ['Ingresos de entregados', dinero(r.ingresos_entregados)]]
  return <section><h2 className="mb-6 text-2xl font-bold">Resumen del negocio</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{indicadores.map(([nombre, valor]) => <article className="panel" key={nombre}><h3>{nombre}</h3><p className="mt-3 text-3xl font-bold">{valor}</p></article>)}</div></section>
}
