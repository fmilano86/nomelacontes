from fastapi import APIRouter, Depends, HTTPException, Query
from app.core.deps import get_current_active_user, require_role
from app.modules.usuarios.schemas import UserPublic
from app.modules.productos.service import ProductoNoEncontrado
from .schemas import PedidoCreate, PedidoRead, PedidosPaginados, CambioEstado, ResumenPedidos, EstadoPedido
from .service import PedidoService, PedidoNoEncontrado, PedidoAjeno, StockInsuficiente, ProductoNoDisponible, ProductoRepetido, TransicionInvalida
from .unit_of_work import PedidoUnitOfWork
router = APIRouter(prefix='/pedidos', tags=['Pedidos'])
def get_pedido_service(): return PedidoService(PedidoUnitOfWork())
def ejecutar(operacion):
    try: return operacion()
    except (PedidoNoEncontrado, ProductoNoEncontrado) as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except PedidoAjeno as error:
        raise HTTPException(status_code=403, detail=str(error)) from error
    except (StockInsuficiente, ProductoNoDisponible, ProductoRepetido, TransicionInvalida) as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
@router.post('', response_model=PedidoRead, status_code=201)
def crear(data: PedidoCreate, usuario: UserPublic = Depends(get_current_active_user), service: PedidoService = Depends(get_pedido_service)):
    return ejecutar(lambda: service.crear(data, usuario.id))
@router.get('', response_model=PedidosPaginados)
def listar(skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100), estado: EstadoPedido | None = None, usuario: UserPublic = Depends(get_current_active_user), service: PedidoService = Depends(get_pedido_service)):
    return ejecutar(lambda: service.listar(usuario, skip, limit, estado))
@router.get('/resumen', response_model=ResumenPedidos)
def resumen(usuario: UserPublic = Depends(require_role(['admin'])), service: PedidoService = Depends(get_pedido_service)):
    return ejecutar(service.resumen)
@router.get('/{id}', response_model=PedidoRead)
def obtener(id: int, usuario: UserPublic = Depends(get_current_active_user), service: PedidoService = Depends(get_pedido_service)):
    return ejecutar(lambda: service.obtener(id, usuario))
@router.patch('/{id}/estado', response_model=PedidoRead)
def cambiar(id: int, data: CambioEstado, usuario: UserPublic = Depends(require_role(['admin'])), service: PedidoService = Depends(get_pedido_service)):
    return ejecutar(lambda: service.cambiar(id, data.estado, usuario))
@router.patch('/{id}/cancelar', response_model=PedidoRead)
def cancelar(id: int, usuario: UserPublic = Depends(get_current_active_user), service: PedidoService = Depends(get_pedido_service)):
    return ejecutar(lambda: service.cambiar(id, 'CANCELADO', usuario, cancelar_propio=True))
