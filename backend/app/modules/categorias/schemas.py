from pydantic import ConfigDict, field_validator
from sqlmodel import SQLModel
from pydantic import Field

class CategoriaCreate(SQLModel):
    nombre: str = Field(min_length=2, max_length=100)
    descripcion: str | None = None
    @field_validator('nombre', mode='before')
    @classmethod
    def limpiar_nombre(cls, value):
        return value.strip() if isinstance(value, str) else value

class CategoriaUpdate(SQLModel):
    nombre: str | None = Field(default=None, min_length=2, max_length=100)
    descripcion: str | None = None
    @field_validator('nombre', mode='before')
    @classmethod
    def limpiar_nombre(cls, value):
        return value.strip() if isinstance(value, str) else value

class CategoriaRead(CategoriaCreate):
    id: int
    activo: bool
    model_config = ConfigDict(from_attributes=True)
