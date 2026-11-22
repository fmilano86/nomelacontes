import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { Producto, ProductoDatos } from '@/features/productos/types'
import { useProductos, useProductoMutations } from '@/features/productos/hooks/useProductos'
import { useCategorias } from '@/features/categorias'
import { ProductoForm } from '@/features/productos/components/ProductoForm'
import { StockForm } from '@/features/productos/components/StockForm'
import { DataTable } from '@/shared/components/DataTable'
import { Modal } from '@/shared/components/Modal'
import { EstadoError, Skeleton, Paginacion } from '@/shared/components/ListaEstados'
import { dinero } from '@/shared/format'
const VACIO: Producto[] = []
export function AdminProductosPage() {
  const [bloque, setBloque] = useState(0)
  const listado = useProductos({ skip: bloque * 100, limit: 100 }), categorias = useCategorias()
  const { guardar, eliminar, stock } = useProductoMutations()
  const [abierto, setAbierto] = useState(false), [seleccionado, setSeleccionado] = useState<Producto | null>(null), [stockProducto, setStockProducto] = useState<Producto | null>(null)
  const [mensaje, setMensaje] = useState('')
  const ocupado = guardar.isPending || eliminar.isPending || stock.isPending
  function abrir(producto: Producto | null) { guardar.reset(); eliminar.reset(); setMensaje(''); setSeleccionado(producto); setAbierto(true) }
  async function guardarDatos(datos: ProductoDatos) {
    // Conservar la FK anterior si su categoría fue dada de baja y no se cambió.
    const cambios = datos
    await guardar.mutateAsync({ id: seleccionado?.id, datos: cambios }); setAbierto(false); setMensaje('Producto guardado.')
  }
  const columns: ColumnDef<Producto>[] = [
    { accessorKey: 'nombre', header: 'Nombre' }, { id: 'categoria', header: 'Categoría', accessorFn: x => x.categoria.nombre },
    { accessorKey: 'precio_base', header: 'Precio', cell: x => dinero(Number(x.getValue())) }, { accessorKey: 'stock', header: 'Stock' },
    { accessorKey: 'disponible', header: 'Disponible', cell: x => x.getValue() ? 'Sí' : 'No' },
    { id: 'acciones', header: 'Acciones', cell: ({ row }) => <div className="flex flex-wrap gap-2"><button className="btn-secondary" disabled={ocupado} onClick={() => abrir(row.original)}>Editar</button><button className="btn-secondary" disabled={ocupado} onClick={() => { stock.reset(); setStockProducto(row.original) }}>Stock</button><button className="btn-danger" disabled={ocupado} onClick={() => { if (window.confirm(`¿Dar de baja ${row.original.nombre}?`)) eliminar.mutate(row.original.id, { onSuccess: () => setMensaje('Producto dado de baja.') }) }}>Eliminar</button></div> },
  ]
  return <section><h2 className="mb-5 text-2xl font-bold">Productos</h2><button className="btn-primary mb-5" disabled={ocupado || !categorias.data?.length} onClick={() => abrir(null)}>Nuevo producto</button>{mensaje && <p role="status" className="mb-4">{mensaje}</p>}{listado.isPending && <Skeleton />}{listado.isError && <EstadoError error={listado.error} />}{categorias.isError && <EstadoError error={categorias.error} />}{eliminar.isError && <EstadoError error={eliminar.error} />}{listado.data && <><DataTable data={listado.data.items ?? VACIO} columns={columns} />{listado.data.total > 100 && <><p className="mt-5">Bloques de 100 productos; la tabla pagina dentro de cada bloque.</p><Paginacion pagina={bloque} limite={100} total={listado.data.total} cambiar={setBloque} /></>}</>}
    <Modal abierto={abierto} titulo={seleccionado ? 'Editar producto' : 'Nuevo producto'} ocupado={ocupado} onCerrar={() => setAbierto(false)}>{guardar.isError && <EstadoError error={guardar.error} />}{abierto && <ProductoForm key={seleccionado?.id ?? 'nuevo'} producto={seleccionado} categorias={categorias.data ?? []} ocupado={ocupado} guardar={guardarDatos} cancelar={() => setAbierto(false)} />}</Modal>
    <Modal abierto={stockProducto !== null} titulo={`Stock de ${stockProducto?.nombre ?? ''}`} ocupado={ocupado} onCerrar={() => setStockProducto(null)}>{stock.isError && <EstadoError error={stock.error} />}{stockProducto && <StockForm key={stockProducto.id} producto={stockProducto} ocupado={ocupado} guardar={async datos => { await stock.mutateAsync(datos); setStockProducto(null); setMensaje('Stock actualizado.') }} />}</Modal>
  </section>
}
