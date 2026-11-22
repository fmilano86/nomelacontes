import { flexRender, type Table } from '@tanstack/react-table'
import { Vacio } from '@/shared/components/Estados'
export interface TablaProps<T> { tabla: Table<T> }
export function Tabla<T>({ tabla }: TablaProps<T>) {
  if (tabla.getCoreRowModel().rows.length === 0) return <Vacio />
  return <>
    <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
      <table className="w-full text-left">
        <thead className="bg-orange-100 dark:bg-stone-800"><tr>{tabla.getHeaderGroups()[0].headers.map(header =>
          <th key={header.id} className="p-4" scope="col" aria-sort={header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : 'none'}>
            <button disabled={!header.column.getCanSort()} onClick={header.column.getToggleSortingHandler()}>
              {flexRender(header.column.columnDef.header, header.getContext())}
              {header.column.getIsSorted() === 'asc' ? ' ↑' : header.column.getIsSorted() === 'desc' ? ' ↓' : ''}
            </button>
          </th>)}</tr></thead>
        <tbody>{tabla.getRowModel().rows.map(row => <tr key={row.id} className="border-t border-stone-100 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800">
          {row.getVisibleCells().map(cell => <td key={cell.id} className="p-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
        </tr>)}</tbody>
      </table>
    </div>
    <div className="mt-6 flex items-center justify-center gap-5">
      <button className="btn-secondary" disabled={!tabla.getCanPreviousPage()} onClick={() => tabla.previousPage()}>Anterior</button>
      <span>Página {tabla.getState().pagination.pageIndex + 1} de {tabla.getPageCount()}</span>
      <button className="btn-secondary" disabled={!tabla.getCanNextPage()} onClick={() => tabla.nextPage()}>Siguiente</button>
    </div>
  </>
}
