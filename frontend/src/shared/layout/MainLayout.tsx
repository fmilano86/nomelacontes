import { Link, Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { ThemeLayout } from '@/shared/components/ThemeLayout'
export function MainLayout() { return <ThemeLayout><Navbar /><main className="mx-auto max-w-7xl p-5 md:p-8"><Outlet /></main><footer className="mt-10 border-t border-stone-200 p-6 text-center text-sm">Food Store · Facundo Milano · Programación IV</footer></ThemeLayout> }
export function AdminLayout() { return <><h1 className="mb-5 text-3xl font-bold">Panel de administración</h1><nav aria-label="Administración" className="mb-8 flex flex-wrap gap-4 rounded-xl bg-orange-100 p-4 dark:bg-stone-800">{[['resumen', 'Resumen'], ['categorias', 'Categorías'], ['productos', 'Productos'], ['pedidos', 'Pedidos'], ['usuarios', 'Usuarios']].map(([ruta, nombre]) => <Link className="underline" key={ruta} to={`/admin/${ruta}`}>{nombre}</Link>)}</nav><Outlet /></> }
