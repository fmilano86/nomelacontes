from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
def hash_password(password: str):
    return pwd_context.hash(password)
def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)
def create_access_token(user_id: int):
    exp = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({'sub': str(user_id), 'exp': exp}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
def decode_access_token(token: str):
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
