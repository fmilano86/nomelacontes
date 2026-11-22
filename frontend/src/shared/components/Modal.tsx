import type { ReactNode } from 'react'
export interface ModalProps {
  abierto: boolean;
  titulo: string;
  ocupado: boolean;
  onCerrar: () => void;
  children: ReactNode;
}
export function Modal({ abierto, titulo, ocupado, onCerrar, children }: ModalProps) {
  if (!abierto) return null
  return <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 p-4" onKeyDown={e => { if (e.key === 'Escape' && !ocupado) onCerrar() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="modal-titulo" className="max-h-[90vh] w-full max-w-xl overflow-auto rounded-2xl bg-white dark:bg-stone-900 p-7 shadow-xl">
      <div className="mb-5 flex items-center justify-between gap-5">
        <h2 id="modal-titulo" className="text-2xl font-bold">{titulo}</h2>
        <button type="button" disabled={ocupado} aria-label="Cerrar formulario" onClick={onCerrar}>Cerrar</button>
      </div>
      {children}
    </section>
  </div>
}
