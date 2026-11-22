from app.core.unit_of_work import UnitOfWork
from app.core.database import session_factory
from .repository import CategoriaRepository

class CategoriaUnitOfWork(UnitOfWork):
    def __init__(self, factory=session_factory):
        super().__init__(factory)
    def __enter__(self):
        super().__enter__()
        self.categorias = CategoriaRepository(self.session)
        return self
