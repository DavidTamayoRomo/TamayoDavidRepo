# TamayoDavidRepo
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Ejercicio práctico - FullStack Developer


1. Clonar proyecto
2. Ubicarse en la ruta proyecto clonado
3. Editar el archivo docker-compose.yml
```
Variable de entorno de nestjs-app
KAFKA_BROKER = IP_MI_PC

Reemplazar la IP_MI_PC por su IP
KAFKA_ADVERTISED_LISTENERS: LISTENER_DOCKER_INTERNAL://kafka1:19091,LISTENER_DOCKER_EXTERNAL://IP_MI_PC:9091
```
5. Levantar proyecto con docker-compose
```
docker-compose up -d --build
```


## Documentacion EndPoind
```
http://localhost:3000/docs
```

## GRAPHQL
```
http://localhost:3000/graphql
```

## KAFKA
```
http://localhost:9000/
```

