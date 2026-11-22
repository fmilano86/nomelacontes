import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, type ColumnDef } from '@tanstack/react-table'
import { Tabla } from './Tabla'
export function DataTable<T>({ data, columns }: { data: T[]; columns: ColumnDef<T>[] }) {
  const tabla = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(), initialState: { pagination: { pageSize: 5 } } })
  return <Tabla tabla={tabla} />
}
