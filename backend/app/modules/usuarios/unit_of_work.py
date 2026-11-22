from app.core.unit_of_work import UnitOfWork
from app.core.database import session_factory
from .repository import UsuarioRepository

class UsuarioUnitOfWork(UnitOfWork):
    def __init__(self, factory=session_factory):
        super().__init__(factory)
    def __enter__(self):
        super().__enter__()
        self.usuarios = UsuarioRepository(self.session)
        return self
