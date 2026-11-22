import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { Usuario } from '@/features/auth'
import { useUsuarios } from '@/features/usuarios/hooks/useUsuarios'
import { useAuthStore } from '@/store/authStore'
import { DataTable } from '@/shared/components/DataTable'
import { Skeleton, EstadoError } from '@/shared/components/ListaEstados'
export function AdminUsuariosPage() {
  const { listado, cambiar } = useUsuarios(), actual = useAuthStore(s => s.usuario)
  const [mensaje, setMensaje] = useState('')
  const columns: ColumnDef<Usuario>[] = [
    { accessorKey: 'username', header: 'Usuario' }, { accessorKey: 'full_name', header: 'Nombre' }, { accessorKey: 'email', header: 'Email' }, { accessorKey: 'role', header: 'Rol' },
    { accessorKey: 'disabled', header: 'Estado', cell: x => x.getValue() ? 'Desactivado' : 'Activo' },
    { id: 'acciones', header: 'Acciones', cell: ({ row }) => row.original.id === actual?.id ? <span>Tu cuenta</span> : <button className="btn-secondary" disabled={cambiar.isPending} onClick={() => cambiar.mutate({ id: row.original.id, activar: row.original.disabled }, { onSuccess: () => setMensaje('Estado del usuario actualizado.') })}>{row.original.disabled ? 'Activar' : 'Desactivar'}</button> },
  ]
  return <section><h2 className="mb-6 text-2xl font-bold">Usuarios</h2>{mensaje && <p role="status" className="my-4">{mensaje}</p>}{listado.isPending && <Skeleton />}{listado.isError && <EstadoError error={listado.error} />}{cambiar.isError && <EstadoError error={cambiar.error} />}{listado.data && <DataTable data={listado.data} columns={columns} />}</section>
}
