from pydantic import ConfigDict, field_validator
from sqlmodel import SQLModel
from pydantic import Field
from app.modules.categorias.schemas import CategoriaRead

class ProductoCreate(SQLModel):
    categoria_id: int = Field(gt=0)
    nombre: str = Field(min_length=2, max_length=100)
    descripcion: str | None = None
    precio_base: float = Field(ge=0, allow_inf_nan=False)
    imagen_url: str | None = None
    stock: int = Field(default=0, ge=0)
    disponible: bool = True
    @field_validator('nombre', mode='before')
    @classmethod
    def limpiar_nombre(cls, value):
        return value.strip() if isinstance(value, str) else value

class ProductoUpdate(SQLModel):
    categoria_id: int | None = Field(default=None, gt=0)
    nombre: str | None = Field(default=None, min_length=2, max_length=100)
    descripcion: str | None = None
    precio_base: float | None = Field(default=None, ge=0, allow_inf_nan=False)
    imagen_url: str | None = None
    stock: int | None = Field(default=None, ge=0)
    disponible: bool | None = None
    @field_validator('nombre', mode='before')
    @classmethod
    def limpiar_nombre(cls, value):
        return value.strip() if isinstance(value, str) else value

class ProductoRead(ProductoCreate):
    id: int
    activo: bool
    categoria: CategoriaRead
    model_config = ConfigDict(from_attributes=True)

class ProductoStockUpdate(SQLModel):
    stock: int = Field(ge=0)
    disponible: bool

class ProductosPaginados(SQLModel):
    total: int
    items: list[ProductoRead]
