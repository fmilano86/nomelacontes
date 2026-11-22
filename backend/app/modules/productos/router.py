from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.exc import IntegrityError
from app.core.deps import require_role
from app.modules.usuarios.schemas import UserPublic
from app.modules.categorias.service import CategoriaNoEncontrada, NombreDuplicado, DatosInvalidos
from app.modules.productos.service import ProductoNoEncontrado
from .service import ProductoService
from .unit_of_work import ProductoUnitOfWork
from .schemas import ProductoCreate, ProductoUpdate, ProductoRead, ProductosPaginados, ProductoStockUpdate

router = APIRouter(prefix='/productos', tags=['Productos'])
def get_service(): return ProductoService(ProductoUnitOfWork())
def ejecutar(operacion):
    try: return operacion()
    except (CategoriaNoEncontrada, ProductoNoEncontrado) as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except NombreDuplicado as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    except DatosInvalidos as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except IntegrityError as error:
        raise HTTPException(status_code=409, detail='El registro ya existe o tiene referencias inválidas') from error
@router.get('', response_model=ProductosPaginados)
def listar(skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100), search: str | None = None, categoria_id: int | None = Query(None, gt=0), disponible: bool | None = None, service: ProductoService = Depends(get_service)):
    return ejecutar(lambda: service.listar(skip, limit, search, categoria_id, disponible))

@router.get('/{id}', response_model=ProductoRead)
def obtener(id: int, service: ProductoService = Depends(get_service)):
    return ejecutar(lambda: service.obtener(id))
@router.post('', response_model=ProductoRead, status_code=201)
def crear(data: ProductoCreate, usuario: UserPublic = Depends(require_role(['admin'])), service: ProductoService = Depends(get_service)):
    return ejecutar(lambda: service.guardar(data))
@router.put('/{id}', response_model=ProductoRead)
def actualizar(id: int, data: ProductoUpdate, usuario: UserPublic = Depends(require_role(['admin'])), service: ProductoService = Depends(get_service)):
    return ejecutar(lambda: service.guardar(data, id))
@router.patch('/{id}/stock', response_model=ProductoRead)
def stock(id: int, data: ProductoStockUpdate, usuario: UserPublic = Depends(require_role(['admin'])), service: ProductoService = Depends(get_service)):
    return ejecutar(lambda: service.stock(id, data))

@router.delete('/{id}', status_code=204)
def eliminar(id: int, usuario: UserPublic = Depends(require_role(['admin'])), service: ProductoService = Depends(get_service)):
    ejecutar(lambda: service.eliminar(id))
    return Response(status_code=204)
