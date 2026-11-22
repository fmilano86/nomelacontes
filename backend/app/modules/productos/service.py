from .models import Producto
from .schemas import ProductoRead, ProductosPaginados
from app.modules.categorias.service import CategoriaNoEncontrada, DatosInvalidos
class ProductoNoEncontrado(Exception): pass

class ProductoService:
    def __init__(self, uow): self.uow = uow
    def buscar(self, uow, id):
        producto = uow.productos.get_by_id(id)
        if not producto or not producto.activo: raise ProductoNoEncontrado('Producto inexistente')
        return producto
    def listar(self, skip, limit, search, categoria_id, disponible):
        with self.uow as uow:
            total, productos = uow.productos.search(skip, limit, search, categoria_id, disponible)
            return ProductosPaginados(total=total, items=[ProductoRead.model_validate(p) for p in productos])
    def obtener(self, id):
        with self.uow as uow:
            return ProductoRead.model_validate(self.buscar(uow, id))
    def guardar(self, data, id=None):
        with self.uow as uow:
            producto = Producto() if id is None else self.buscar(uow, id)
            cambios = data.model_dump(exclude_unset=True)
            for campo in ['categoria_id', 'nombre', 'precio_base', 'stock', 'disponible']:
                if campo in cambios and cambios[campo] is None: raise DatosInvalidos(f'{campo} no puede ser nulo')
            if 'categoria_id' in cambios:
                categoria = uow.categorias.get_by_id(cambios['categoria_id'])
                if not categoria or not categoria.activo: raise CategoriaNoEncontrada('Categoría inexistente')
            producto.sqlmodel_update(cambios)
            uow.productos.add(producto)
            # Si cambia la FK, refrescar la relación antes de serializar.
            uow.session.expire(producto, ['categoria'])
            return ProductoRead.model_validate(producto)
    def stock(self, id, data):
        with self.uow as uow:
            producto = self.buscar(uow, id)
            producto.sqlmodel_update(data.model_dump())
            return ProductoRead.model_validate(producto)
    def eliminar(self, id):
        with self.uow as uow:
            self.buscar(uow, id).activo = False
