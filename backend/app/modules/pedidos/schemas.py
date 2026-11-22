from datetime import datetime
from typing import Literal
from pydantic import ConfigDict, field_validator
from sqlmodel import SQLModel
from pydantic import Field

EstadoPedido = Literal['PENDIENTE', 'EN_PREPARACION', 'ENTREGADO', 'CANCELADO']
class ItemPedidoCreate(SQLModel):
    producto_id: int = Field(gt=0)
    cantidad: int = Field(ge=1)
class PedidoCreate(SQLModel):
    items: list[ItemPedidoCreate] = Field(min_length=1)
    forma_pago: Literal['EFECTIVO', 'TRANSFERENCIA']
    direccion_entrega: str = Field(min_length=5, max_length=200)
    notas: str | None = None
    @field_validator('direccion_entrega', mode='before')
    @classmethod
    def limpiar_direccion(cls, value):
        return value.strip() if isinstance(value, str) else value
class DetallePedidoRead(SQLModel):
    producto_id: int
    nombre_producto: str
    precio_unitario: float
    cantidad: int
    subtotal: float
    model_config = ConfigDict(from_attributes=True)
class PedidoRead(SQLModel):
    id: int
    usuario_id: int
    estado: EstadoPedido
    forma_pago: Literal['EFECTIVO', 'TRANSFERENCIA']
    direccion_entrega: str
    notas: str | None
    total: float
    created_at: datetime
    updated_at: datetime
    items: list[DetallePedidoRead]
    model_config = ConfigDict(from_attributes=True)
class CambioEstado(SQLModel):
    estado: EstadoPedido
class PedidosPaginados(SQLModel):
    total: int
    items: list[PedidoRead]
class ResumenPedidos(SQLModel):
    pendientes: int
    en_preparacion: int
    entregados: int
    cancelados: int
    pedidos_hoy: int
    ingresos_entregados: float
