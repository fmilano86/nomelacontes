import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, type ColumnDef } from '@tanstack/react-table'
import type { Categoria } from '@/features/categorias/types'
import { useCategorias, useCategoriaMutations } from '@/features/categorias/hooks/useCategorias'
import { Tabla as CategoriaList } from '@/shared/components/Tabla'
import { Modal as CategoriaModal } from '@/shared/components/Modal'
import { Cargando, ErrorEstado } from '@/shared/components/Estados'

const SIN_DATOS: Categoria[] = []
export function AdminCategoriasPage() {
  const esAdmin = useAuthStore(s => s.usuario?.role === 'admin')
  const [abierto, setAbierto] = useState(false)
  const [seleccionado, setSeleccionado] = useState<Categoria | null>(null)
  const listado = useCategorias()
  const { guardar, eliminar } = useCategoriaMutations()
  const ocupado = guardar.isPending || eliminar.isPending
  const form = useForm({
    defaultValues: { nombre: '', descripcion: '' },
    validators: {
      onSubmit: ({ value }) => {
        if (value.nombre.trim().length < 2 || value.nombre.trim().length > 100) return { fields: { nombre: 'El nombre es obligatorio' } }
        return undefined
      },
    },
    onSubmit: async ({ value }) => {
      const datos = { ...value, nombre: value.nombre.trim() }
      await guardar.mutateAsync({ id: seleccionado?.id, datos })
      setAbierto(false)
    },
  })
  function abrir(item: Categoria | null) {
    guardar.reset(); eliminar.reset()
    setSeleccionado(item)
    form.reset({ nombre: item?.nombre ?? '', descripcion: item?.descripcion ?? '' })
    setAbierto(true)
  }
  function borrar(item: Categoria) {
    if (!ocupado && window.confirm(`¿Eliminar ${item.nombre}?`)) eliminar.mutate(item.id)
  }
  const columnas: ColumnDef<Categoria>[] = [
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'descripcion', header: 'Descripción' },
  ]
  if (esAdmin) columnas.push({ id: 'acciones', header: 'Acciones', enableSorting: false, cell: ({ row }) => <div className="flex gap-3">
      <button className="btn-secondary" disabled={ocupado} onClick={() => abrir(row.original)}>Editar</button>
      <button className="btn-danger" disabled={ocupado} onClick={() => borrar(row.original)}>Eliminar</button>
    </div> })
  const tabla = useReactTable({
    data: listado.data ?? SIN_DATOS, columns: columnas,
    getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  })
  return <main className="mx-auto max-w-6xl p-6">
    <header className="my-6 rounded-xl bg-orange-100 dark:bg-stone-800 p-6"><p>Food Store · Trabajo Práctico Integrador</p><h1 className="mt-2 text-3xl font-bold">Categorías</h1></header>
    {esAdmin && <button className="btn-primary mb-6" disabled={ocupado} onClick={() => abrir(null)}>Nueva categoría</button>}
    {listado.isLoading && <Cargando />}
    {listado.isError && <ErrorEstado mensaje={listado.error.message} onReintentar={() => void listado.refetch()} />}
    
    {eliminar.isError && <ErrorEstado mensaje={eliminar.error.message} />}
    {eliminar.isSuccess && <p role="status" className="mb-4 text-green-800 dark:text-green-300">Registro eliminado.</p>}
    {listado.data && <CategoriaList tabla={tabla} />}
    <CategoriaModal abierto={abierto && esAdmin} titulo={seleccionado ? 'Editar categoría' : 'Nueva categoría'} ocupado={ocupado} onCerrar={() => setAbierto(false)}>
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); if (!ocupado) void form.handleSubmit().catch(() => { /* La mutación muestra el error debajo. */ }) }}>
        <form.Field name="nombre" validators={{ onChange: ({ value }) => value.trim().length < 2 || value.trim().length > 100 ? 'El nombre debe tener entre 2 y 100 caracteres' : undefined }}>{field => <div><label htmlFor="nombre" className="mb-1 block font-semibold">Nombre</label><input id="nombre" disabled={ocupado} onBlur={field.handleBlur} className="campo" type="text" value={field.state.value} onChange={e => field.handleChange(e.target.value)} />
          {field.state.meta.errors.map((error, i) => <p key={i} className="mt-1 text-sm text-red-800 dark:text-red-200">{String(error)}</p>)}
        </div>}</form.Field>
<form.Field name="descripcion" >{field => <div><label htmlFor="descripcion" className="mb-1 block font-semibold">Descripción</label><textarea id="descripcion" disabled={ocupado} onBlur={field.handleBlur} className="campo" value={field.state.value} onChange={e => field.handleChange(e.target.value)} />
          {field.state.meta.errors.map((error, i) => <p key={i} className="mt-1 text-sm text-red-800 dark:text-red-200">{String(error)}</p>)}
        </div>}</form.Field>
        {guardar.isError && <ErrorEstado mensaje={guardar.error.message} />}
        <div className="flex justify-end gap-3">
          <button className="btn-secondary" type="button" disabled={ocupado} onClick={() => setAbierto(false)}>Cancelar</button>
          <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => <button className="btn-primary" type="submit" disabled={!canSubmit || isSubmitting || ocupado}>{ocupado ? 'Guardando...' : 'Guardar'}</button>}
          </form.Subscribe>
        </div>
      </form>
    </CategoriaModal>
    <footer className="mt-10 text-center text-sm text-stone-600 dark:text-stone-300">Facundo Milano · Programación IV</footer>
  </main>
}
