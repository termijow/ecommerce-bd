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