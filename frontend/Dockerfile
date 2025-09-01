# frontend/Dockerfile
FROM node:18-alpine AS base

WORKDIR /usr/src/app

# Copia package.json y package-lock.json (o yarn.lock)
COPY package*.json ./

# Instala dependencias
# Si usas yarn:
# RUN yarn install
# Si usas npm:
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# El puerto que expone Next.js por defecto
EXPOSE 3000

# Comando por defecto para desarrollo (puede ser sobreescrito en docker-compose)
CMD ["npm", "run", "dev"]