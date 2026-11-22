export function Cargando() {
  return <p role="status" className="rounded-xl bg-orange-50 dark:bg-stone-800 p-6 animate-pulse">Cargando datos...</p>
}
export function Vacio() {
  return <p className="rounded-xl border border-dashed p-6">No hay registros. Podés crear uno con el botón superior.</p>
}
interface ErrorProps { mensaje: string; onReintentar?: () => void }
export function ErrorEstado({ mensaje, onReintentar }: ErrorProps) {
  return <div role="alert" className="my-4 rounded-xl bg-red-50 dark:bg-red-950 p-4 text-red-800 dark:text-red-200">{mensaje}
    {onReintentar && <button className="ml-4 underline" onClick={onReintentar}>Reintentar</button>}
  </div>
}
