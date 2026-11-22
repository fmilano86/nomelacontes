import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProductos, saveProducto, deleteProducto, patchStock } from '@/features/productos/api/productos'
import type { FiltrosProductos } from '@/features/productos/types'
export function useProductos(filtros: FiltrosProductos) { return useQuery({ queryKey: ['productos', filtros], queryFn: () => getProductos(filtros) }) }
export function useProductoMutations() {
  const client = useQueryClient()
  const actualizar = async () => { await client.invalidateQueries({ queryKey: ['productos'] }) }
  const guardar = useMutation({ mutationFn: saveProducto, onSuccess: actualizar })
  const eliminar = useMutation({ mutationFn: deleteProducto, onSuccess: actualizar })
  const stock = useMutation({ mutationFn: patchStock, onSuccess: actualizar })
  return { guardar, eliminar, stock }
}
