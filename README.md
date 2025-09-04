# Configuración docker

Para correr los contenedores de docker, hay que usar los siguientes comandos:

Para montarlo (solo se ejecuta una vez)

```
docker compose up --build
```

si sale algun error, ponerle sudo para darle permisos.

## Luego de la primera vez ejecutar este

```bash
docker compose up
```

En caso de tener algun error, como en mi caso, porque no se instalaron los paquetes de npm
```bash
sh: next not found
```

Ejecutar los siguientes comandos:
```bash
docker compose exec frontend npm install
docker compose exec backend python manage.py migrate
docker compose exec backend pip install -r requirements.txt
```

En caso de tener algun error de sintaxis, instalarlo en local

```
# 1. Instalar dependencias de frontend
cd frontend
npm install
cd ..

# 2. Instalar dependencias de backend (Python)
cd backend
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

# 3. Migrar la base de datos de Django
python manage.py migrate
cd ..
```

## Para ejecutar el archivo de postgres.sql

```bash
docker exec -i ecommerce_bd_db psql -U ecommerce_bd_user -d ecommerce_bd_dev < postgres.sql
sudo docker compose exec backend python manage.py createsuperuser
```

## Roadmap del Proyecto
Fase 0: Configuración del Entorno de Desarrollo (¡Completada!)
Objetivo: Establecer una base de desarrollo robusta y reproducible.
[✔] Inicializar el repositorio en Git.
[✔] Crear la estructura de directorios (backend/, frontend/).
[✔] Configurar docker-compose.yml para orquestar los servicios:
Servicio db: PostgreSQL 15.
Servicio backend: Django REST Framework.
Servicio frontend: Next.js.
[✔] Crear Dockerfile para el backend.
[✔] Crear Dockerfile para el frontend.
[✔] Verificar que todos los servicios se levanten correctamente.
Fase 1: Backend y Base de Datos (¡Completada!)
Objetivo: Construir la estructura de datos, la lógica de negocio en la base de datos y la API REST.
[✔] Diseño de Base de Datos:
Crear el script init-db.sql con la definición de:
Roles de Usuario: administrador, empleados, clientes_rol.
Procedimiento Almacenado: registrar_pedido para lógica transaccional.
Función: ventas_totales para cálculos agregados.
Trigger: actualizar_stock para automatizar el inventario.
[✔] Modelos de Django:
Crear los modelos en models.py (Usuario, Cliente, Producto, Pedido, etc.) para que se correspondan con la base de datos.
[✔] API REST:
Implementar Serializers para la conversión de datos.
Implementar ViewSets para exponer los endpoints CRUD.
Crear endpoints personalizados (@action) para llamar al PROCEDURE y FUNCTION de PostgreSQL.
[✔] Documentación de la API:
Integrar drf-spectacular para generar una interfaz de Swagger UI en /api/docs/.
[✔] Panel de Administración:
Configurar el Django Admin para tener una interfaz tipo "Prisma Studio" en /admin/.
## Fase 2: Frontend - Conexión y Visualización de Datos (En Progreso)
Objetivo: Conectar la interfaz de usuario de Next.js con la API del backend para mostrar y crear datos.
[Paso 2.1] Configurar un cliente HTTP (ej. axios o fetch nativo) para realizar llamadas a la API de Django.
[Paso 2.2] (AQUÍ VAMOS) Crear un componente simple para listar los productos obtenidos desde el endpoint GET /api/productos/.
[Paso 2.3] Implementar un formulario para crear un nuevo producto usando el endpoint POST /api/productos/.
[Paso 2.4] Crear una interfaz para simular la creación de un pedido, llamando al endpoint POST /api/pedidos/registrar-nuevo-pedido/.
[Paso 2.5] Mostrar datos calculados por la base de datos, como el total de ventas, llamando a GET /api/pedidos/ventas-totales/.
Fase 3: Despliegue y Presentación
Objetivo: Poner la aplicación en producción y preparar la presentación final.
[Paso 3.1] Preparar la aplicación para el despliegue (configurar ALLOWED_HOSTS, DEBUG=False, etc.).
[Paso 3.2] Desplegar la aplicación en una plataforma (ej. Vercel para el frontend, Railway/Fly.io para el backend y la DB).
[Paso 3.3] Preparar la presentación en formato "Elevator Pitch" (máx. 10 minutos).
[Paso 3.4] Grabar la presentación y entregar el proyecto.