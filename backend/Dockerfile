# backend/Dockerfile

# Usar una imagen oficial de Python como base
FROM python:3.10-slim-bullseye

# Establecer variables de entorno para Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Instalar dependencias del sistema (si son necesarias, por ejemplo, para psycopg2 o Pillow)
# libpq-dev es para psycopg2 (PostgreSQL adapter)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copiar el archivo de requerimientos primero para aprovechar el cache de Docker
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copiar el resto del código fuente de la aplicación al directorio de trabajo
# Esto será sobrescrito por el volumen en docker-compose para desarrollo,
# pero es necesario para construir la imagen si no se usa un volumen.
COPY . .

# Exponer el puerto en el que Django se ejecuta (generalmente 8000)
# La variable PORT del docker-compose.yml puede ser usada por Django para determinar el puerto si se configura así
EXPOSE 8000

# Comando para iniciar el servidor de desarrollo de Django
# Escucha en todas las interfaces (0.0.0.0) para que sea accesible desde el host
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]