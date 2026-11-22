from datetime import datetime, timezone
from .models import Pedido, DetallePedido
from .schemas import PedidoRead, PedidosPaginados, ResumenPedidos
from app.modules.productos.service import ProductoNoEncontrado

class PedidoNoEncontrado(Exception): pass
class PedidoAjeno(Exception): pass
class StockInsuficiente(Exception): pass
class ProductoNoDisponible(Exception): pass
class ProductoRepetido(Exception): pass
class TransicionInvalida(Exception): pass

TRANSICIONES = {
    'PENDIENTE': {'EN_PREPARACION', 'CANCELADO'},
    'EN_PREPARACION': {'ENTREGADO', 'CANCELADO'},
    'ENTREGADO': set(), 'CANCELADO': set(),
}
class PedidoService:
    def __init__(self, uow): self.uow = uow
    def buscar(self, uow, id, bloquear=False):
        pedido = uow.pedidos.get_for_update(id) if bloquear else uow.pedidos.get_by_id(id)
        if not pedido: raise PedidoNoEncontrado('Pedido inexistente')
        return pedido
    def permiso(self, pedido, usuario):
        if usuario.role != 'admin' and pedido.usuario_id != usuario.id:
            raise PedidoAjeno('El pedido pertenece a otro usuario')
    def crear(self, data, usuario_id):
        with self.uow as uow:
            ids = [item.producto_id for item in data.items]
            if len(ids) != len(set(ids)): raise ProductoRepetido('No se puede repetir un producto en el pedido')
            pedido = Pedido(usuario_id=usuario_id, forma_pago=data.forma_pago, direccion_entrega=data.direccion_entrega, notas=data.notas)
            uow.pedidos.add(pedido)
            total = 0
            # Orden estable de bloqueos de stock para pedidos concurrentes en PostgreSQL.
            for item in sorted(data.items, key=lambda x: x.producto_id):
                producto = uow.productos.get_for_update(item.producto_id)
                if not producto or not producto.activo: raise ProductoNoEncontrado('Producto inexistente o dado de baja')
                if not producto.disponible: raise ProductoNoDisponible(f'{producto.nombre} no está disponible')
                if producto.stock < item.cantidad: raise StockInsuficiente(f'Stock insuficiente de {producto.nombre}')
                producto.stock -= item.cantidad
                subtotal = round(producto.precio_base * item.cantidad, 2)
                pedido.items.append(DetallePedido(producto_id=producto.id, cantidad=item.cantidad, nombre_producto=producto.nombre, precio_unitario=producto.precio_base, subtotal=subtotal))
                total += subtotal
            pedido.total = round(total, 2)
            uow.session.flush()
            return PedidoRead.model_validate(pedido)
    def listar(self, usuario, skip, limit, estado):
        with self.uow as uow:
            id = None if usuario.role == 'admin' else usuario.id
            total, pedidos = uow.pedidos.list_by_usuario(id, skip, limit, estado)
            return PedidosPaginados(total=total, items=[PedidoRead.model_validate(p) for p in pedidos])
    def obtener(self, id, usuario):
        with self.uow as uow:
            pedido = self.buscar(uow, id)
            self.permiso(pedido, usuario)
            return PedidoRead.model_validate(pedido)
    def cambiar(self, id, nuevo_estado, usuario, cancelar_propio=False):
        with self.uow as uow:
            pedido = self.buscar(uow, id, bloquear=True)
            self.permiso(pedido, usuario)
            if cancelar_propio:
                if pedido.usuario_id != usuario.id: raise PedidoAjeno('El pedido pertenece a otro usuario')
                if pedido.estado != 'PENDIENTE': raise TransicionInvalida('Solo podés cancelar un pedido pendiente')
                nuevo_estado = 'CANCELADO'
            if nuevo_estado not in TRANSICIONES[pedido.estado]: raise TransicionInvalida('Transición de estado inválida')
            if nuevo_estado == 'CANCELADO':
                for item in sorted(pedido.items, key=lambda x: x.producto_id):
                    producto = uow.productos.get_for_update(item.producto_id)
                    producto.stock += item.cantidad
            pedido.estado = nuevo_estado
            pedido.updated_at = datetime.now(timezone.utc)
            return PedidoRead.model_validate(pedido)
    def resumen(self):
        with self.uow as uow:
            return ResumenPedidos(**uow.pedidos.resumen())
