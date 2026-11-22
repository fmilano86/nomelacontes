import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
export function ProtectedRoute({ admin = false }: { admin?: boolean }) {
  const usuario = useAuthStore(s => s.usuario), cargando = useAuthStore(s => s.cargando)
  const location = useLocation()
  if (cargando) return <p role="status">Verificando sesión...</p>
  if (!usuario) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (admin && usuario.role !== 'admin') return <Navigate to="/unauthorized" replace />
  return <Outlet />
}
