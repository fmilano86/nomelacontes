import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsuarios, cambiarUsuario } from '@/features/usuarios/api/usuarios'
export function useUsuarios() {
  const client = useQueryClient()
  const listado = useQuery({ queryKey: ['usuarios'], queryFn: getUsuarios })
  const cambiar = useMutation({ mutationFn: cambiarUsuario, onSuccess: async () => { await client.invalidateQueries({ queryKey: ['usuarios'] }) } })
  return { listado, cambiar }
}
