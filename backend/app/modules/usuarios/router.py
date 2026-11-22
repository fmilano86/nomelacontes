from fastapi import APIRouter, Depends
from app.core.deps import require_role
from .schemas import UserPublic
from .service import UsuarioService
router = APIRouter(prefix='/admin/usuarios', tags=['Usuarios'])
def get_usuario_service(): return UsuarioService()
@router.get('', response_model=list[UserPublic])
def listar(usuario: UserPublic = Depends(require_role(['admin'])), service: UsuarioService = Depends(get_usuario_service)):
    return service.listar()
@router.post('/{id}/activar', response_model=UserPublic)
def activar(id: int, usuario: UserPublic = Depends(require_role(['admin'])), service: UsuarioService = Depends(get_usuario_service)):
    return service.cambiar(id, False, usuario.id)
@router.post('/{id}/desactivar', response_model=UserPublic)
def desactivar(id: int, usuario: UserPublic = Depends(require_role(['admin'])), service: UsuarioService = Depends(get_usuario_service)):
    return service.cambiar(id, True, usuario.id)
