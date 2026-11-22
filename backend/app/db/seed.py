from sqlmodel import select
from app.core.database import create_all_tables, session_factory
from app.core.unit_of_work import UnitOfWork
from app.core.security import hash_password
from app.modules.usuarios.models import Usuario
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto

def main():
    create_all_tables()
    with UnitOfWork(session_factory) as uow:
        session = uow.session
        if not session.exec(select(Usuario).where(Usuario.username == 'admin')).first():
            session.add(Usuario(username='admin', full_name='Administrador Food Store', email='admin@foodstore.com', hashed_password=hash_password('Admin1234!'), role='admin'))
        categorias = {}
        for nombre in ['Hamburguesas', 'Pizzas', 'Bebidas']:
            categoria = session.exec(select(Categoria).where(Categoria.nombre == nombre)).first()
            if not categoria:
                categoria = Categoria(nombre=nombre, descripcion=f'Nuestros productos de {nombre.lower()}')
                session.add(categoria); session.flush()
            categorias[nombre] = categoria.id
        datos = [
            ('Hamburguesa clásica', 'Carne, lechuga y tomate', 6500, 'Hamburguesas'),
            ('Hamburguesa doble', 'Doble carne y queso', 8500, 'Hamburguesas'),
            ('Hamburguesa vegetariana', 'Medallón de lentejas y vegetales', 6000, 'Hamburguesas'),
            ('Pizza muzzarella', 'Salsa de tomate, muzzarella y aceitunas', 9500, 'Pizzas'),
            ('Pizza napolitana', 'Muzzarella, tomate y ajo', 10500, 'Pizzas'),
            ('Pizza especial', 'Jamón, morrón y muzzarella', 11500, 'Pizzas'),
            ('Gaseosa 500 ml', 'Bebida sin alcohol', 2200, 'Bebidas'),
            ('Agua mineral 500 ml', 'Agua sin gas', 1500, 'Bebidas'),
        ]
        for nombre, descripcion, precio, categoria in datos:
            if not session.exec(select(Producto).where(Producto.nombre == nombre)).first():
                session.add(Producto(nombre=nombre, descripcion=descripcion, precio_base=precio, categoria_id=categorias[categoria], stock=30, disponible=True))
    print('Seed listo: admin / Admin1234! · 3 categorías · 8 productos (sin duplicar existentes).')

if __name__ == '__main__': main()
