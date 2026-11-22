import { useState } from 'react'
import { useProductos } from '@/features/productos/hooks/useProductos'
import { useCategorias } from '@/features/categorias'
import { ProductoCard } from '@/features/productos/components/ProductoCard'
import { Skeleton, EstadoError, EstadoVacio, Paginacion } from '@/shared/components/ListaEstados'
export function CatalogoPage() {
  const [pagina, setPagina] = useState(0), [search, setSearch] = useState(''), [categoria, setCategoria] = useState('')
  const limite = 6
  const categorias = useCategorias(), productos = useProductos({ skip: pagina * limite, limit: limite, search: search || undefined, categoria_id: categoria ? Number(categoria) : undefined })
  return <><section className="mb-7 rounded-2xl bg-orange-100 p-7 dark:bg-stone-800"><p>Comida rica, pedidos simples</p><h1 className="mt-2 text-4xl font-bold">Elegí tu próxima comida</h1><p className="mt-3">Armá el carrito y confirmá tu dirección y forma de pago.</p></section><div className="mb-6 flex flex-wrap gap-4"><label className="min-w-52 flex-1">Buscar por nombre<input className="campo" type="search" placeholder="Ej.: pizza" value={search} onChange={e => { setSearch(e.target.value); setPagina(0) }} /></label><label>Categoría<select className="campo" value={categoria} onChange={e => { setCategoria(e.target.value); setPagina(0) }}><option value="">Todas</option>{categorias.data?.map(c => <option value={c.id} key={c.id}>{c.nombre}</option>)}</select></label></div>
    {categorias.isError && <EstadoError error={categorias.error} />}{productos.isPending && <Skeleton />}{productos.isError && <EstadoError error={productos.error} />}{productos.data && <>{productos.data.items.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{productos.data.items.map(p => <ProductoCard key={p.id} producto={p} />)}</div> : <EstadoVacio mensaje="No encontramos productos con esos filtros." />}<Paginacion pagina={pagina} total={productos.data.total} limite={limite} cambiar={setPagina} /></>}
  </>
}
