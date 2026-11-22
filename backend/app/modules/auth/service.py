from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from app.core.security import hash_password, verify_password
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork
from .schemas import UserCreate, UserPublic

class AuthService:
    def registrar(self, data: UserCreate):
        try:
            with UsuarioUnitOfWork() as uow:
                if uow.usuarios.get_by_username(data.username) or uow.usuarios.get_by_email(data.email):
                    raise HTTPException(status_code=409, detail='El usuario o email ya está registrado')
                # bcrypt admite hasta 72 bytes; no truncar contraseñas silenciosamente.
                if len(data.password.encode('utf-8')) > 72:
                    raise HTTPException(status_code=422, detail='La contraseña no puede superar 72 bytes')
                usuario = Usuario(username=data.username, full_name=data.full_name, email=data.email, hashed_password=hash_password(data.password))
                uow.usuarios.add(usuario)
                return UserPublic.model_validate(usuario)
        except IntegrityError:
            raise HTTPException(status_code=409, detail='El usuario o email ya está registrado')
    def login(self, username: str, password: str):
        with UsuarioUnitOfWork() as uow:
            usuario = uow.usuarios.get_by_username(username)
            if not usuario or not verify_password(password, usuario.hashed_password):
                raise HTTPException(status_code=401, detail='Credenciales incorrectas')
            if usuario.disabled: raise HTTPException(status_code=400, detail='Cuenta de usuario desactivada')
            return UserPublic.model_validate(usuario)
