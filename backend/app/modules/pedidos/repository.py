from datetime import datetime, time, timedelta, timezone
from sqlmodel import select, func
from app.core.base_repository import BaseRepository
from .models import Pedido
class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session):
        super().__init__(session, Pedido)
    def list_by_usuario(self, usuario_id, skip, limit, estado=None):
        condiciones = []
        if usuario_id is not None: condiciones.append(Pedido.usuario_id == usuario_id)
        if estado is not None: condiciones.append(Pedido.estado == estado)
        total = self.session.exec(select(func.count()).select_from(Pedido).where(*condiciones)).one()
        items = self.session.exec(select(Pedido).where(*condiciones).order_by(Pedido.id.desc()).offset(skip).limit(limit)).all()
        return total, items
    def get_for_update(self, id):
        return self.session.exec(select(Pedido).where(Pedido.id == id).with_for_update()).first()
    def count_by_estado(self):
        return dict(self.session.exec(select(Pedido.estado, func.count()).group_by(Pedido.estado)).all())
    def resumen(self):
        conteos = self.count_by_estado()
        inicio = datetime.combine(datetime.now(timezone.utc).date(), time.min, tzinfo=timezone.utc)
        hoy = self.session.exec(select(func.count()).select_from(Pedido).where(Pedido.created_at >= inicio, Pedido.created_at < inicio + timedelta(days=1))).one()
        ingresos = self.session.exec(select(func.coalesce(func.sum(Pedido.total), 0)).where(Pedido.estado == 'ENTREGADO')).one()
        return dict(pendientes=conteos.get('PENDIENTE', 0), en_preparacion=conteos.get('EN_PREPARACION', 0), entregados=conteos.get('ENTREGADO', 0), cancelados=conteos.get('CANCELADO', 0), pedidos_hoy=hoy, ingresos_entregados=ingresos)
