from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from app.core.config import settings
from app.core.security import create_access_token
from app.core.deps import get_current_active_user
from .schemas import UserCreate, UserPublic
from .service import AuthService

router = APIRouter(prefix='/auth', tags=['Autenticación'])
def get_auth_service(): return AuthService()
@router.post('/register', response_model=UserPublic, status_code=201)
def registrar(data: UserCreate, service: AuthService = Depends(get_auth_service)):
    return service.registrar(data)
@router.post('/token')
def login(response: Response, form: OAuth2PasswordRequestForm = Depends(), service: AuthService = Depends(get_auth_service)):
    usuario = service.login(form.username, form.password)
    response.set_cookie('access_token', create_access_token(usuario.id), httponly=True, samesite='lax', secure=settings.FRONTEND_ORIGIN.startswith('https://'), max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60, path='/')
    return {'message': 'Login exitoso'}
@router.post('/logout')
def logout(response: Response):
    response.delete_cookie('access_token', path='/')
    return {'message': 'Sesión cerrada'}
@router.get('/me', response_model=UserPublic)
def me(usuario: UserPublic = Depends(get_current_active_user)):
    return usuario
