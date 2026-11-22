import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { AppRouter } from '@/routes/AppRouter'
export function App() {
  const checkSession = useAuthStore(s => s.checkSession)
  const cargando = useAuthStore(s => s.cargando)
  useEffect(() => { void checkSession() }, [checkSession])
  // Evita que la limpieza de una sesi�n inv�lida interrumpa la consulta del cat�logo.
  if (cargando) return <p role="status" className="p-8">Verificando sesi�n...</p>
  return <AppRouter />
}
