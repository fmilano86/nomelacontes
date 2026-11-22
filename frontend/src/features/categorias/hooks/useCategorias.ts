import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategorias, saveCategoria, deleteCategoria } from '@/features/categorias/api/categorias'
export function useCategorias() { return useQuery({ queryKey: ['categorias'], queryFn: getCategorias }) }
export function useCategoriaMutations() {
  const client = useQueryClient()
  async function actualizar() { await Promise.all([client.invalidateQueries({ queryKey: ['categorias'] }), client.invalidateQueries({ queryKey: ['productos'] })]) }
  const guardar = useMutation({ mutationFn: saveCategoria, onSuccess: actualizar })
  const eliminar = useMutation({ mutationFn: deleteCategoria, onSuccess: actualizar })
  return { guardar, eliminar }
}
