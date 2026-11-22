from fastapi import Depends, Cookie, HTTPException
from jose import JWTError
from app.core.security import decode_access_token
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork
from app.modules.usuarios.schemas import UserPublic

def get_current_user(access_token: str | None = Cookie(default=None)):
    try:
        if not access_token: raise ValueError()
        id = int(decode_access_token(access_token)['sub'])
    except (JWTError, ValueError, KeyError, TypeError):
        raise HTTPException(status_code=401, detail='Sesión inválida o vencida')
    with UsuarioUnitOfWork() as uow:
        usuario = uow.usuarios.get_by_id(id)
        if usuario is None: raise HTTPException(status_code=401, detail='Sesión inválida o vencida')
        return UserPublic.model_validate(usuario)

def get_current_active_user(usuario: UserPublic = Depends(get_current_user)):
    if usuario.disabled: raise HTTPException(status_code=400, detail='Cuenta de usuario desactivada')
    return usuario

def require_role(roles: list[str]):
    def verificar(usuario: UserPublic = Depends(get_current_active_user)):
        if usuario.role not in roles: raise HTTPException(status_code=403, detail='Acceso denegado')
        return usuario
    return verificar
