from sqlmodel import SQLModel, Session, create_engine
from sqlalchemy import event
from app.core.config import settings

opciones = {'check_same_thread': False} if settings.DATABASE_URL.startswith('sqlite') else {}
engine = create_engine(settings.DATABASE_URL, connect_args=opciones)
if settings.DATABASE_URL.startswith('sqlite'):
    @event.listens_for(engine, 'connect')
    def activar_claves_foraneas(connection, _record):
        connection.execute('PRAGMA foreign_keys=ON')

def session_factory():
    return Session(engine)

def create_all_tables():
    from app.modules.usuarios.models import Usuario
    from app.modules.categorias.models import Categoria
    from app.modules.productos.models import Producto
    from app.modules.pedidos.models import Pedido, DetallePedido
    SQLModel.metadata.create_all(engine)
