from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.exc import IntegrityError
from app.core.deps import require_role
from app.modules.usuarios.schemas import UserPublic
from app.modules.categorias.service import CategoriaNoEncontrada, NombreDuplicado, DatosInvalidos
from app.modules.productos.service import ProductoNoEncontrado
from .service import CategoriaService
from .unit_of_work import CategoriaUnitOfWork
from .schemas import CategoriaCreate, CategoriaUpdate, CategoriaRead

router = APIRouter(prefix='/categorias', tags=['Categorias'])
def get_service(): return CategoriaService(CategoriaUnitOfWork())
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
@router.get('', response_model=list[CategoriaRead])
def listar(service: CategoriaService = Depends(get_service)):
    return ejecutar(service.listar)

@router.get('/{id}', response_model=CategoriaRead)
def obtener(id: int, service: CategoriaService = Depends(get_service)):
    return ejecutar(lambda: service.obtener(id))
@router.post('', response_model=CategoriaRead, status_code=201)
def crear(data: CategoriaCreate, usuario: UserPublic = Depends(require_role(['admin'])), service: CategoriaService = Depends(get_service)):
    return ejecutar(lambda: service.guardar(data))
@router.put('/{id}', response_model=CategoriaRead)
def actualizar(id: int, data: CategoriaUpdate, usuario: UserPublic = Depends(require_role(['admin'])), service: CategoriaService = Depends(get_service)):
    return ejecutar(lambda: service.guardar(data, id))

@router.delete('/{id}', status_code=204)
def eliminar(id: int, usuario: UserPublic = Depends(require_role(['admin'])), service: CategoriaService = Depends(get_service)):
    ejecutar(lambda: service.eliminar(id))
    return Response(status_code=204)
