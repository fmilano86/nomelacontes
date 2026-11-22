# Food Store — Trabajo Práctico Integrador

**Facundo Milano**  
Tecnicatura Universitaria en Programación · Programación IV

**Repositorio público:** https://github.com/fmilano86/nomelacontes  
**Video demostrativo:** [Ver demostración de Food Store en YouTube](https://youtu.be/c8U1PkCEyYA).

## Descripción

Food Store permite consultar un catálogo, armar un carrito, registrarse, iniciar sesión y crear pedidos con dirección de entrega y forma de pago. El administrador gestiona categorías, productos, stock, pedidos y usuarios, y consulta un resumen del negocio.

El proyecto continúa el trabajo de las unidades anteriores. Se conserva la arquitectura en capas del backend, el Unit of Work, la autenticación mediante cookie HttpOnly, los formularios y tablas con TanStack y la organización por features del frontend. El modelo se adapta al UML del integrador: una categoría por producto, un rol por usuario y cinco entidades. Ingredientes y unidades de medida no forman parte del alcance de este enunciado.

## Requisitos

- Python 3.11, 3.12 o 3.13.
- PostgreSQL 15 o posterior. Para desarrollo local también se permite SQLite.
- Node.js 20.19 o posterior y pnpm 9 o posterior.
- Puertos disponibles: backend `8000` y frontend `5173`.

Las dependencias del backend están fijadas en `backend/requirements.txt` y las del frontend en `frontend/package.json`.

## Preparar la base de datos

Crear una base vacía llamada `foodstore_db` en PostgreSQL, mediante pgAdmin o con SQL:

```sql
CREATE DATABASE foodstore_db;
```

Se utiliza una base nueva para el modelo del integrador. No conectar con las tablas de las unidades anteriores, porque cambiaron campos y relaciones.

## Instalación y ejecución del backend

Abrir una terminal en la carpeta `backend`:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Editar `.env` con los datos de conexión a PostgreSQL y reemplazar `SECRET_KEY` por una clave propia de al menos 32 caracteres. La contraseña de la conexión debe corresponder al usuario de PostgreSQL local.

Si PowerShell bloquea la activación, se pueden ejecutar los comandos con el intérprete del entorno sin activarlo:

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -m app.db.seed
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Con el entorno activado, cargar los datos iniciales y arrancar la API:

```powershell
python -m app.db.seed
uvicorn app.main:app --reload
```

Ejecutar siempre desde `backend`, donde se encuentra el paquete `app`. El seed crea las tablas y carga el administrador, tres categorías y ocho productos con stock. Es idempotente: volver a ejecutarlo no duplica esos registros ni restablece el stock modificado.

En Linux o macOS se activa el entorno con `source venv/bin/activate` y se copia el ejemplo con `cp .env.example .env`; los demás comandos son iguales.

### Usuario administrador del seed

Credenciales públicas de demostración exigidas por la consigna de la cátedra (TPI Food Store, página 16). Corresponden al usuario que el seed crea en una base local nueva; no son credenciales personales ni de un servicio existente. Los archivos `.env` privados y las bases de datos no se publican.

| Campo | Valor |
| --- | --- |
| Usuario de login | `admin` |
| Contraseña | `Admin1234!` |
| Rol | `admin` |
| Email | `admin@foodstore.com` |

Los clientes se crean desde el formulario público de registro. El login utiliza **username**, no email.

Documentación de la API:

- Swagger: `http://localhost:8000/docs`.
- ReDoc: `http://localhost:8000/redoc`.
- Prefijo de los endpoints: `http://localhost:8000/api/v1`.

### Variables del backend

| Variable | Ejemplo y uso |
| --- | --- |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/foodstore_db`; reemplazar usuario y contraseña. |
| `SECRET_KEY` | Clave propia de al menos 32 caracteres para firmar JWT. |
| `ALGORITHM` | `HS256`. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30`; duración del token y de la cookie. |
| `FRONTEND_ORIGIN` | `http://localhost:5173`; origen exacto permitido en CORS. |

Para trabajar localmente con SQLite, reemplazar únicamente `DATABASE_URL` por `sqlite:///./foodstore.db` y volver a ejecutar el seed. PostgreSQL es la base principal de la aplicación. Los bloqueos de filas de PostgreSQL protegen el stock al procesar pedidos concurrentes; SQLite se utiliza para desarrollo local.

## Instalación y ejecución del frontend

En otra terminal, abrir la carpeta `frontend`:

```powershell
Copy-Item .env.example .env
pnpm install
pnpm build
pnpm dev
```

Abrir `http://localhost:5173`. Mantener encendido el backend. `pnpm build` verifica TypeScript y genera `dist`; `pnpm dev` inicia Vite.

| Variable | Valor |
| --- | --- |
| `VITE_API_URL` | `http://localhost:8000/api/v1` |

La URL incluye `/api/v1`. Reiniciar Vite después de cambiarla. Usar `localhost` para ambos proyectos, sin alternarlo con `127.0.0.1`, para que la cookie de sesión corresponda al mismo host. El frontend envía las peticiones con `withCredentials: true` y el backend habilita CORS con credenciales para el origen configurado.

## Organización del proyecto

| Carpeta | Contenido |
| --- | --- |
| `backend/app/core` | Configuración, base de datos, seguridad, dependencias, repositorio base y Unit of Work. |
| `backend/app/modules/auth` | Registro, login, logout y perfil. |
| `backend/app/modules/usuarios` | Usuarios, roles y activación/desactivación. |
| `backend/app/modules/categorias` | CRUD de categorías y baja lógica. |
| `backend/app/modules/productos` | CRUD, búsqueda, filtros, paginación, stock y disponibilidad. |
| `backend/app/modules/pedidos` | Pedidos, detalles, transiciones, cancelación y resumen. |
| `backend/app/db/seed.py` | Datos iniciales idempotentes. |
| `frontend/src/features` | Features `auth`, `categorias`, `productos`, `pedidos` y `usuarios`, con páginas, componentes, hooks, API y tipos según su función. |
| `frontend/src/shared` | Axios, QueryClient, manejo de errores, tabla, modal, paginación, skeleton, estados de listas y layout. |
| `frontend/src/store` | Sesión, carrito y tema con Zustand. |
| `frontend/src/routes` | Rutas públicas, de sesión y de administración. |

Cada feature expone sus páginas y tipos mediante `index.ts`. El alias `@/` apunta a `src`. TypeScript utiliza `strict: true`.

## Reglas principales

El Router resuelve las dependencias y traduce los errores de dominio a respuestas HTTP. El Service abre el Unit of Work y aplica las reglas; el Repository realiza las consultas. El Unit of Work confirma la transacción o la revierte cuando ocurre una excepción y siempre cierra la sesión. Los servicios de categorías, productos y pedidos devuelven schemas dentro del bloque `with`.

Un pedido requiere productos distintos, activos, disponibles y con stock suficiente. El backend toma el nombre y el precio del producto; no acepta precios ni totales enviados por el carrito. El descuento de stock, las líneas y el pedido se guardan en una única transacción. Las líneas conservan su nombre y precio aunque el catálogo cambie después.

| Estado actual | Siguiente estado permitido |
| --- | --- |
| `PENDIENTE` | `EN_PREPARACION` o `CANCELADO`. |
| `EN_PREPARACION` | `ENTREGADO` o `CANCELADO`. |
| `ENTREGADO` | Ninguno. |
| `CANCELADO` | Ninguno. |

El cliente consulta sus pedidos y solo cancela los propios en `PENDIENTE`. El administrador gestiona todos y puede cancelar también en preparación. Cancelar devuelve el stock en la misma transacción. Los pedidos no tienen endpoints para editar sus líneas, cambiar el total o borrarlos.

Las categorías y productos utilizan baja lógica. La baja de una categoría no libera su nombre ni oculta sus productos. El administrador no puede desactivar su propia cuenta. El backend verifica los permisos en cada petición, además de la protección visual de React.

La cookie `access_token` es HttpOnly: React nunca lee ni guarda el JWT. `authStore` persiste únicamente el perfil y confirma la sesión con `/auth/me` al montar; mientras espera, las rutas protegidas muestran un indicador. `cartStore` persiste los ítems. TanStack Query mantiene los datos del servidor y las mutaciones invalidan las consultas afectadas.

## Pantallas

| Ruta | Función |
| --- | --- |
| `/` | Catálogo público con búsqueda, categorías, paginación del servidor y agregado al carrito. |
| `/login`, `/register` | Formularios de acceso y registro con TanStack Form. |
| `/carrito` | Cantidades, subtotales y total estimado; conserva los ítems al recargar. |
| `/checkout` | Dirección, efectivo o transferencia y notas. Requiere sesión. |
| `/mis-pedidos` | Pedidos del cliente, detalle y cancelación pendiente. |
| `/admin/resumen` | Indicadores por estado, pedidos del día e ingresos de entregados. |
| `/admin/categorias` | ABM con TanStack Table y TanStack Form. |
| `/admin/productos` | ABM, stock y disponibilidad. La API trae bloques de 100 y la tabla pagina cada bloque. |
| `/admin/pedidos` | Filtro por estado, detalle y acciones de transición. |
| `/admin/usuarios` | Listado, activación y desactivación. |
| `/unauthorized` | Acceso denegado. |

El pago es manual y se coordina con el negocio; no se integra una pasarela de cobro. El resumen del día utiliza fechas UTC. Los importes del carrito son estimativos y se confirman al crear el pedido.

## Recorrido para el video de demostración

1. **Minutos 0 a 1:** presentación con cámara encendida: nombre, materia y objetivo de Food Store.
2. **Minutos 1 a 3:** mostrar catálogo, búsqueda, filtro, paginación y registro de un cliente.
3. **Minutos 3 a 5:** iniciar sesión, agregar productos, cambiar cantidades y recargar para mostrar que el carrito persiste.
4. **Minutos 5 a 7:** confirmar dirección y forma de pago; crear un pedido y mostrar sus líneas y total en Mis pedidos.
5. **Minutos 7 a 10:** ingresar como admin; mostrar resumen, categorías, productos, stock, usuarios y avanzar un pedido de pendiente a preparación y entregado.
6. **Minutos 10 a 12:** crear otro pedido pendiente; mostrar el stock descontado, cancelarlo como cliente y volver al panel para mostrar la restitución exacta.
7. **Minutos 12 a 14:** mostrar la protección por rol, Swagger y la ubicación del Unit of Work y del mapa de transiciones.

La grabación se comparte mediante el enlace a YouTube incluido al principio de este README. El video no se incluye como `.mp4` dentro del ZIP.

## Formato de la entrega

El ZIP contiene `backend/`, `frontend/` y este `README.md` en la raíz, junto con `.gitignore`. Los enlaces al repositorio público y al video se encuentran al principio del documento. El repositorio contiene el mismo proyecto. Se excluyen `node_modules`, `venv`, `.venv`, `.env`, bases locales, cachés y archivos de video; se conservan ambos `.env.example`.
