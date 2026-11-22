export const dinero = (valor: number) => valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
export const fecha = (valor: string) => new Date(valor).toLocaleString('es-AR')
