import type { Categoria } from '@/features/categorias'
export interface ProductoDatos { nombre: string; descripcion: string | null; precio_base: number; imagen_url: string | null; categoria_id: number; stock: number; disponible: boolean }
export interface Producto extends ProductoDatos { id: number; activo: boolean; categoria: Categoria }
export interface ProductosPaginados { total: number; items: Producto[] }
export interface FiltrosProductos { skip: number; limit: number; search?: string; categoria_id?: number; disponible?: boolean }
