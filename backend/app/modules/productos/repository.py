from sqlmodel import select, func
from app.core.base_repository import BaseRepository
from .models import Producto
class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session):
        super().__init__(session, Producto)
    def search(self, skip, limit, search=None, categoria_id=None, disponible=None):
        condiciones = [Producto.activo == True]
        if search:
            condiciones.append(Producto.nombre.icontains(search, autoescape=True))
        if categoria_id is not None:
            condiciones.append(Producto.categoria_id == categoria_id)
        if disponible is not None:
            condiciones.append(Producto.disponible == disponible)
        total = self.session.exec(select(func.count()).select_from(Producto).where(*condiciones)).one()
        items = self.session.exec(select(Producto).where(*condiciones).order_by(Producto.id).offset(skip).limit(limit)).all()
        return total, items
    def get_for_update(self, id):
        return self.session.exec(select(Producto).where(Producto.id == id).with_for_update()).first()
