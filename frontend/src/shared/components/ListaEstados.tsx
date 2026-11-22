import { handleApiError } from '@/shared/api/handleApiError'
export function EstadoError({ error }: { error: unknown }) { return <p role="alert" className="my-4 rounded-xl bg-red-50 p-4 text-red-800 dark:bg-red-950 dark:text-red-200">{handleApiError(error)}</p> }
export function Skeleton() { return <div role="status" aria-label="Cargando" className="my-6 grid animate-pulse gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map(n => <div key={n} className="h-52 rounded-xl bg-stone-200 dark:bg-stone-800" />)}<span className="sr-only">Cargando...</span></div> }
export function EstadoVacio({ mensaje = 'No hay registros para mostrar.' }: { mensaje?: string }) { return <p className="panel my-6 text-center">{mensaje}</p> }
export function Paginacion({ pagina, total, limite, cambiar }: { pagina: number; total: number; limite: number; cambiar: (pagina: number) => void }) {
  return <div className="my-6 flex items-center justify-center gap-4"><button className="btn-secondary" disabled={pagina === 0} onClick={() => cambiar(pagina - 1)}>Anterior</button><span>Página {pagina + 1} de {Math.max(1, Math.ceil(total / limite))}</span><button className="btn-secondary" disabled={(pagina + 1) * limite >= total} onClick={() => cambiar(pagina + 1)}>Siguiente</button></div>
}
