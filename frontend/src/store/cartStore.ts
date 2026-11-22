import { create } from 'zustand'
import { persist } from 'zustand/middleware'
export interface ItemCarrito { producto_id: number; nombre: string; precio_unitario: number; cantidad: number }
interface CartState {
  items: ItemCarrito[];
  agregar: (item: Omit<ItemCarrito, 'cantidad'>) => void;
  quitar: (id: number) => void;
  cambiarCantidad: (id: number, cantidad: number) => void;
  vaciar: () => void;
  total: () => number;
}
export const useCartStore = create<CartState>()(persist((set, get) => ({
  items: [],
  agregar: item => set(state => ({ items: state.items.some(x => x.producto_id === item.producto_id) ? state.items.map(x => x.producto_id === item.producto_id ? { ...x, cantidad: x.cantidad + 1 } : x) : [...state.items, { ...item, cantidad: 1 }] })),
  quitar: id => set(state => ({ items: state.items.filter(x => x.producto_id !== id) })),
  cambiarCantidad: (id, cantidad) => { if (Number.isInteger(cantidad) && cantidad >= 1) set(state => ({ items: state.items.map(x => x.producto_id === id ? { ...x, cantidad } : x) })) },
  vaciar: () => set({ items: [] }),
  total: () => get().items.reduce((suma, x) => suma + x.precio_unitario * x.cantidad, 0),
}), { name: 'foodstore-tpi-cart', partialize: state => ({ items: state.items }) }))
