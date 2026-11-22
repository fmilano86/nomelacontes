import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { dinero } from '@/shared/format'
import { EstadoVacio } from '@/shared/components/ListaEstados'
export function CarritoPage() {
  const { items, quitar, cambiarCantidad, vaciar, total } = useCartStore()
  return <section><h1 className="mb-6 text-3xl font-bold">Mi carrito</h1>{!items.length ? <><EstadoVacio mensaje="Tu carrito está vacío." /><Link className="btn-primary inline-block" to="/">Ver catálogo</Link></> : <><div className="space-y-4">{items.map(item => <article className="panel flex flex-wrap items-center gap-5" key={item.producto_id}><div className="flex-1"><h2 className="text-xl font-semibold">{item.nombre}</h2><p>{dinero(item.precio_unitario)} por unidad</p></div><label>Cantidad<input className="campo w-24" type="number" min={1} step={1} value={item.cantidad} onChange={e => cambiarCantidad(item.producto_id, Number(e.target.value))} /></label><strong>{dinero(item.precio_unitario * item.cantidad)}</strong><button className="btn-danger" onClick={() => quitar(item.producto_id)}>Quitar</button></article>)}</div><p className="my-6 text-2xl font-bold">Total estimado: {dinero(total())}</p><p className="mb-5">El servidor confirma el precio y el stock al crear el pedido.</p><div className="flex gap-4"><button className="btn-secondary" onClick={vaciar}>Vaciar carrito</button><Link className="btn-primary" to="/checkout">Confirmar compra</Link></div></>}</section>
}
