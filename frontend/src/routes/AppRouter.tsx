import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { MainLayout, AdminLayout } from '@/shared/layout/MainLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage, RegisterPage, UnauthorizedPage } from '@/features/auth'
import { CatalogoPage, AdminProductosPage } from '@/features/productos'
import { AdminCategoriasPage } from '@/features/categorias'
import { CarritoPage, CheckoutPage, MisPedidosPage, AdminPedidosPage, AdminResumenPage } from '@/features/pedidos'
import { AdminUsuariosPage } from '@/features/usuarios'
export function AppRouter() { return <BrowserRouter><Routes><Route element={<MainLayout />}>
  <Route path="/" element={<CatalogoPage />} /><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} /><Route path="/unauthorized" element={<UnauthorizedPage />} /><Route path="/carrito" element={<CarritoPage />} />
  <Route element={<ProtectedRoute />}><Route path="/checkout" element={<CheckoutPage />} /><Route path="/mis-pedidos" element={<MisPedidosPage />} /></Route>
  <Route element={<ProtectedRoute admin />}><Route element={<AdminLayout />}><Route path="/admin/resumen" element={<AdminResumenPage />} /><Route path="/admin/categorias" element={<AdminCategoriasPage />} /><Route path="/admin/productos" element={<AdminProductosPage />} /><Route path="/admin/pedidos" element={<AdminPedidosPage />} /><Route path="/admin/usuarios" element={<AdminUsuariosPage />} /></Route></Route>
  <Route path="*" element={<section><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></section>} />
</Route></Routes></BrowserRouter> }
