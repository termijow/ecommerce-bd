# Configuración docker

Para correr los contenedores de docker, hay que usar los siguientes comandos:

Para montarlo (solo se ejecuta una vez)

```bash
docker compose up
```
si sale algun error, ponerle sudo para darle permisos.

## Luego de la primera vez ejecutar este
```
sudo docker compose up --build
```

En caso de tener algun error, como en mi caso, porque no se instalaron los paquetes de npm
```bash
sh: next not found
```

Ejecutar los siguientes comandos:
```bash
docker compose exec frontend sh
npm install
```

### Información util para un futuro

Para almacenar los videos/cursos etc, la mejor opcion es usar S3, pero puede ser caro, y la mejor opcion para tenerlo en un servidor propio es esta:
```
https://min.io/
```
Se podría crear un contenedor en docker para poder crear el servicio y correrlo en el mismo servidor, para ahorrar costos en un futuro.