from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = 'postgresql://postgres:postgres@localhost:5432/foodstore_db'
    SECRET_KEY: str = Field(min_length=32)
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, ge=1)
    FRONTEND_ORIGIN: str = 'http://localhost:5173'
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

settings = Settings()
