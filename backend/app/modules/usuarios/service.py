from fastapi import HTTPException
from .unit_of_work import UsuarioUnitOfWork
from .schemas import UserPublic

class UsuarioService:
    def __init__(self): self.uow = UsuarioUnitOfWork()
    def listar(self):
        with self.uow as uow:
            return [UserPublic.model_validate(x) for x in uow.usuarios.get_all()]
    def cambiar(self, id, disabled, actual_id):
        with self.uow as uow:
            usuario = uow.usuarios.get_by_id(id)
            if not usuario: raise HTTPException(status_code=404, detail='Usuario inexistente')
            if disabled and id == actual_id: raise HTTPException(status_code=400, detail='No podés desactivar tu propia cuenta')
            usuario.disabled = disabled
            return UserPublic.model_validate(usuario)
