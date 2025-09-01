# Etapa 1: Builder
FROM node:18-alpine AS builder
RUN apk update && apk upgrade

WORKDIR /usr/src/app

COPY package*.json ./
# Si usas yarn, también copia yarn.lock
# COPY yarn.lock ./

# Instalar dependencias (incluyendo dependencias de desarrollo para la compilación de TS)
RUN npm install
# Si usas yarn:
# RUN yarn install --frozen-lockfile

COPY . .

# Compilar la aplicación TypeScript a JavaScript
RUN npm run build
# Si usas yarn:
# RUN yarn build

# Etapa 2: Producción
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiar solo las dependencias de producción desde la etapa de builder
# Esto requiere que `npm prune --production` o similar se haya ejecutado o que
# se copien los node_modules de una instalación de producción.
# Una forma más simple para NestJS es instalar solo dependencias de producción aquí.
COPY package*.json ./
RUN npm install --omit=dev
# Si usas yarn:
# COPY yarn.lock ./
# RUN yarn install --production

# Copiar la aplicación compilada (directorio dist) desde la etapa de builder
COPY --from=builder /usr/src/app/dist ./dist

# Copiar Prisma schema si está fuera de dist (a menudo lo está)
# Asegúrate que la ruta a prisma/schema.prisma es correcta desde el WORKDIR /usr/src/app
# Si tu `schema.prisma` está en `backend/prisma/schema.prisma`, y el `context` de build es `./backend`
# entonces debería ser:
# COPY prisma ./prisma
# Y luego, en tu package.json, el script de `prisma generate` debe ejecutarse post-build o antes de start.
# O puedes copiar el cliente generado:
# COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# El puerto en el que la aplicación NestJS escuchará (definido en main.ts o variables de entorno)
# El `docker-compose.yml` ya define la variable de entorno PORT=8000
EXPOSE 8000

# Comando para iniciar la aplicación NestJS
# El usuario 'node' es menos privilegiado, bueno para seguridad.
USER node
CMD ["node", "dist/main.js"]

# --- PARA DESARROLLO ---
# Al igual que con el frontend, `docker-compose.yml` para desarrollo
# sobreescribirá el CMD con algo como `npm run start:dev` y usará volúmenes.
RUN npm install
