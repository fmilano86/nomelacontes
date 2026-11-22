from .models import Categoria
from .schemas import CategoriaRead
class CategoriaNoEncontrada(Exception): pass
class NombreDuplicado(Exception): pass
class DatosInvalidos(Exception): pass

class CategoriaService:
    def __init__(self, uow): self.uow = uow
    def buscar(self, uow, id):
        categoria = uow.categorias.get_by_id(id)
        if not categoria or not categoria.activo: raise CategoriaNoEncontrada('Categoría inexistente')
        return categoria
    def listar(self):
        with self.uow as uow:
            return [CategoriaRead.model_validate(c) for c in uow.categorias.list_active()]
    def obtener(self, id):
        with self.uow as uow:
            return CategoriaRead.model_validate(self.buscar(uow, id))
    def guardar(self, data, id=None):
        with self.uow as uow:
            categoria = Categoria() if id is None else self.buscar(uow, id)
            cambios = data.model_dump(exclude_unset=True)
            if 'nombre' in cambios:
                if cambios['nombre'] is None: raise DatosInvalidos('El nombre no puede ser nulo')
                otra = uow.categorias.get_by_nombre(cambios['nombre'])
                if otra and otra.id != id: raise NombreDuplicado('El nombre de categoría ya existe')
            categoria.sqlmodel_update(cambios)
            uow.categorias.add(categoria)
            return CategoriaRead.model_validate(categoria)
    def eliminar(self, id):
        with self.uow as uow:
            self.buscar(uow, id).activo = False
