export interface CategoriaDatos { nombre: string; descripcion: string | null }
export interface Categoria extends CategoriaDatos { id: number; activo: boolean }
