import { useState } from 'react'
import type { Producto } from '@/features/productos/types'
import { useCartStore } from '@/store/cartStore'
import { dinero } from '@/shared/format'
export function ProductoCard({ producto }: { producto: Producto }) {
  const agregar = useCartStore(s => s.agregar), cantidad = useCartStore(s => s.items.find(x => x.producto_id === producto.id)?.cantidad ?? 0)
  const [sinImagen, setSinImagen] = useState(false)
  return <article className="panel flex flex-col gap-3">{producto.imagen_url && !sinImagen ? <img className="h-40 w-full rounded-xl object-cover" src={producto.imagen_url} alt={producto.nombre} onError={() => setSinImagen(true)} /> : <div className="flex h-32 items-center justify-center rounded-xl bg-orange-100 text-5xl dark:bg-stone-800" aria-hidden="true">🍽️</div>}<p className="text-sm">{producto.categoria.nombre}</p><h2 className="text-xl font-bold">{producto.nombre}</h2><p className="flex-1">{producto.descripcion}</p><strong>{dinero(producto.precio_base)}</strong><p>Stock: {producto.stock}</p><button className="btn-primary" disabled={!producto.disponible || producto.stock <= cantidad} onClick={() => agregar({ producto_id: producto.id, nombre: producto.nombre, precio_unitario: producto.precio_base })}>{!producto.disponible ? 'No disponible' : producto.stock <= cantidad ? 'Sin stock disponible' : cantidad ? `Agregar otro (${cantidad} en carrito)` : 'Agregar al carrito'}</button></article>
}
