import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { usePedidoMutations } from '@/features/pedidos/hooks/usePedidos'
import type { FormaPago } from '@/features/pedidos/types'
import { EstadoError, EstadoVacio } from '@/shared/components/ListaEstados'
import { dinero } from '@/shared/format'
export function CheckoutPage() {
  const items = useCartStore(s => s.items), vaciar = useCartStore(s => s.vaciar), total = useCartStore(s => s.total)
  const { crear } = usePedidoMutations(), navigate = useNavigate()
  const form = useForm({ defaultValues: { direccion_entrega: '', forma_pago: 'EFECTIVO' as FormaPago, notas: '' }, onSubmit: async ({ value }) => {
    if (!items.length) return
    try { await crear.mutateAsync({ ...value, direccion_entrega: value.direccion_entrega.trim(), notas: value.notas || null, items: items.map(x => ({ producto_id: x.producto_id, cantidad: x.cantidad })) }); vaciar(); navigate('/mis-pedidos', { replace: true }) } catch { /* No vaciar el carrito si el backend rechaza la compra. */ }
  } })
  if (!items.length) return <><EstadoVacio mensaje="Agregá productos antes de confirmar un pedido." /><Link to="/">Volver al catálogo</Link></>
  return <section className="panel mx-auto max-w-xl"><h1 className="mb-6 text-3xl font-bold">Confirmar pedido</h1><ul className="mb-4">{items.map(x => <li key={x.producto_id}>{x.cantidad} × {x.nombre}: {dinero(x.cantidad * x.precio_unitario)}</li>)}</ul><strong>Total estimado: {dinero(total())}</strong><form className="mt-5 space-y-5" onSubmit={e => { e.preventDefault(); void form.handleSubmit() }}>
    <form.Field name="direccion_entrega" validators={{ onChange: ({ value }) => value.trim().length < 5 || value.trim().length > 200 ? 'Ingresá entre 5 y 200 caracteres' : undefined }}>{field => <label className="block">Dirección de entrega<input className="campo" required minLength={5} maxLength={200} autoComplete="street-address" disabled={crear.isPending} value={field.state.value} onBlur={field.handleBlur} onChange={e => field.handleChange(e.target.value)} /><small>{field.state.meta.errors.join(', ')}</small></label>}</form.Field>
    <form.Field name="forma_pago">{field => <label className="block">Forma de pago<select className="campo" disabled={crear.isPending} value={field.state.value} onBlur={field.handleBlur} onChange={e => field.handleChange(e.target.value === 'TRANSFERENCIA' ? 'TRANSFERENCIA' : 'EFECTIVO')}><option value="EFECTIVO">Efectivo</option><option value="TRANSFERENCIA">Transferencia</option></select></label>}</form.Field><p className="text-sm">El pago se coordina manualmente con el negocio; no se procesa un cobro en esta aplicación.</p>
    <form.Field name="notas">{field => <label className="block">Notas (opcional)<textarea className="campo" disabled={crear.isPending} value={field.state.value} onBlur={field.handleBlur} onChange={e => field.handleChange(e.target.value)} /></label>}</form.Field>
    {crear.isError && <EstadoError error={crear.error} />}<form.Subscribe selector={s => [s.canSubmit, s.isSubmitting]}>{([canSubmit, submitting]) => <button className="btn-primary" disabled={!canSubmit || submitting || crear.isPending}>{submitting ? 'Confirmando...' : 'Crear pedido'}</button>}</form.Subscribe>
  </form></section>
}
