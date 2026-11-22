import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { registerRequest } from '@/features/auth/api/auth'
import { EstadoError } from '@/shared/components/ListaEstados'
export function LoginPage() {
  const login = useAuthStore(s => s.login), usuario = useAuthStore(s => s.usuario), cargando = useAuthStore(s => s.cargando)
  const [error, setError] = useState<unknown>(null)
  const navigate = useNavigate(), location = useLocation()
  const state = location.state as { from?: string } | null
  const from = state?.from
  const destino = from?.startsWith('/') && !from.startsWith('//') && from !== '/login' ? from : '/'
  const form = useForm({ defaultValues: { username: '', password: '' }, onSubmit: async ({ value }) => {
    setError(null)
    try { await login(value); navigate(destino, { replace: true }) } catch (e: unknown) { setError(e) }
  } })
  if (cargando) return <p role="status">Verificando sesión...</p>
  if (usuario) return <Navigate to={destino} replace />
  return <section className="panel mx-auto max-w-md"><h1 className="mb-6 text-3xl font-bold">Iniciar sesión</h1><form className="space-y-4" onSubmit={e => { e.preventDefault(); void form.handleSubmit() }}>
    <form.Field name="username" validators={{ onChange: ({ value }) => !value.trim() ? 'Ingresá tu usuario' : undefined }}>{field => <label className="block">Usuario<input className="campo mt-1" autoComplete="username" required value={field.state.value} onBlur={field.handleBlur} onChange={e => field.handleChange(e.target.value)} /><small>{field.state.meta.errors.join(', ')}</small></label>}</form.Field>
    <form.Field name="password" validators={{ onChange: ({ value }) => !value ? 'Ingresá tu contraseña' : undefined }}>{field => <label className="block">Contraseña<input className="campo mt-1" type="password" autoComplete="current-password" required value={field.state.value} onBlur={field.handleBlur} onChange={e => field.handleChange(e.target.value)} /><small>{field.state.meta.errors.join(', ')}</small></label>}</form.Field>
    {error !== null && <EstadoError error={error} />}<form.Subscribe selector={s => [s.canSubmit, s.isSubmitting]}>{([canSubmit, submitting]) => <button className="btn-primary" disabled={!canSubmit || submitting}>{submitting ? 'Ingresando...' : 'Ingresar'}</button>}</form.Subscribe>
  </form><Link className="mt-5 block underline" to="/register">Crear una cuenta</Link></section>
}
export function RegisterPage() {
  const navigate = useNavigate()
  const usuario = useAuthStore(s => s.usuario), cargando = useAuthStore(s => s.cargando)
  const registro = useMutation({ mutationFn: registerRequest, onSuccess: () => navigate('/login', { state: { registro: true } }) })
  const form = useForm({ defaultValues: { username: '', full_name: '', email: '', password: '' }, onSubmit: async ({ value }) => { try { await registro.mutateAsync(value) } catch { /* La mutación conserva el error. */ } } })
  if (cargando) return <p role="status">Verificando sesión...</p>
  if (usuario) return <Navigate to="/" replace />
  return <section className="panel mx-auto max-w-md"><h1 className="mb-6 text-3xl font-bold">Crear cuenta</h1><form className="space-y-4" onSubmit={e => { e.preventDefault(); void form.handleSubmit() }}>
    <form.Field name="username" validators={{ onChange: ({ value }) => !/^[a-zA-Z0-9_.-]{3,50}$/.test(value) ? 'Usá entre 3 y 50 letras, números, puntos, guiones o guiones bajos' : undefined }}>{field => <label className="block">Usuario<input className="campo mt-1" required minLength={3} maxLength={50} autoComplete="username" value={field.state.value} onBlur={field.handleBlur} onChange={e => field.handleChange(e.target.value)} /><small>{field.state.meta.errors.join(', ')}</small></label>}</form.Field>
    <form.Field name="full_name" validators={{ onChange: ({ value }) => value.trim().length < 2 ? 'Ingresá tu nombre completo' : undefined }}>{field => <label className="block">Nombre completo<input className="campo mt-1" required minLength={2} maxLength={100} autoComplete="name" value={field.state.value} onBlur={field.handleBlur} onChange={e => field.handleChange(e.target.value)} /><small>{field.state.meta.errors.join(', ')}</small></label>}</form.Field>
    <form.Field name="email" validators={{ onChange: ({ value }) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Ingresá un email válido' : undefined }}>{field => <label className="block">Email<input className="campo mt-1" required type="email" autoComplete="email" value={field.state.value} onBlur={field.handleBlur} onChange={e => field.handleChange(e.target.value)} /><small>{field.state.meta.errors.join(', ')}</small></label>}</form.Field>
    <form.Field name="password" validators={{ onChange: ({ value }) => value.length < 8 || new TextEncoder().encode(value).length > 72 ? 'Usá al menos 8 caracteres y hasta 72 bytes' : undefined }}>{field => <label className="block">Contraseña<input className="campo mt-1" required type="password" minLength={8} maxLength={72} autoComplete="new-password" value={field.state.value} onBlur={field.handleBlur} onChange={e => field.handleChange(e.target.value)} /><small>{field.state.meta.errors.join(', ')}</small></label>}</form.Field>
    {registro.isError && <EstadoError error={registro.error} />}<form.Subscribe selector={s => [s.canSubmit, s.isSubmitting]}>{([canSubmit, submitting]) => <button className="btn-primary" disabled={!canSubmit || submitting}>{submitting ? 'Registrando...' : 'Registrarse'}</button>}</form.Subscribe>
  </form><Link className="mt-5 block underline" to="/login">Ya tengo una cuenta</Link></section>
}
export function UnauthorizedPage() { return <section className="panel"><h1 className="mb-4 text-2xl font-bold">Acceso denegado</h1><p>No tenés permisos para esta pantalla.</p><Link className="mt-4 inline-block underline" to="/">Volver al catálogo</Link></section> }
