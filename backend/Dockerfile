# backend/Dockerfile
# ¡ESTE ARCHIVO YA ESTÁ CORRECTO, NO NECESITAS MODIFICARLO!

# Usar una imagen oficial de Python como base
FROM python:3.10-slim-bullseye

# Establecer variables de entorno para Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Instalar dependencias del sistema (necesarias para psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copiar el archivo de requerimientos primero
COPY requirements.txt .
RUN echo "--- Contenido de requirements.txt DENTRO del build de Docker ---" && cat requirements.txt && echo "------------------------------------------------------------------"

# Instalar dependencias de Python
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copiar el resto del código fuente de la aplicación
COPY . .

# Exponer el puerto
EXPOSE 8000

# Comando para iniciar el servidor de desarrollo de Django
# NOTA: Este CMD será sobreescrito por el `command` en docker-compose.yml
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]