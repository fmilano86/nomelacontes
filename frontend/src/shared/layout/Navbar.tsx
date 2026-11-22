import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useThemeStore } from '@/store/themeStore'
import { EstadoError } from '@/shared/components/ListaEstados'
export function Navbar() {
  const usuario = useAuthStore(s => s.usuario), cargando = useAuthStore(s => s.cargando), logout = useAuthStore(s => s.logout)
  const items = useCartStore(s => s.items), darkMode = useThemeStore(s => s.darkMode), toggle = useThemeStore(s => s.toggleTheme)
  const [error, setError] = useState<unknown>(null)
  const [saliendo, setSaliendo] = useState(false)
  const navigate = useNavigate()
  async function salir() { setSaliendo(true); setError(null); try { await logout(); navigate('/login') } catch (e: unknown) { setError(e) } finally { setSaliendo(false) } }
  return <header className="border-b border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900"><div className="mx-auto flex max-w-7xl flex-wrap items-center gap-5 p-5">
    <Link to="/" className="text-2xl font-bold text-orange-800 dark:text-orange-300">Food Store</Link>
    <nav aria-label="Navegación principal" className="flex flex-wrap gap-4"><NavLink to="/">Catálogo</NavLink><NavLink to="/carrito">Carrito ({items.reduce((n, x) => n + x.cantidad, 0)})</NavLink>{!cargando && usuario && <NavLink to="/mis-pedidos">Mis pedidos</NavLink>}{!cargando && usuario?.role === 'admin' && <NavLink to="/admin/resumen">Panel admin</NavLink>}</nav>
    <div className="ml-auto flex flex-wrap items-center gap-3"><button className="btn-secondary" onClick={toggle}>{darkMode ? 'Tema claro' : 'Tema oscuro'}</button>{cargando ? <span>Verificando sesión...</span> : usuario ? <><span>{usuario.full_name} ({usuario.role})</span><button className="btn-secondary" disabled={saliendo} onClick={() => void salir()}>Cerrar sesión</button></> : <><Link to="/login">Ingresar</Link><Link to="/register">Registrarse</Link></>}</div>
  </div>{error !== null && <EstadoError error={error} />}</header>
}
