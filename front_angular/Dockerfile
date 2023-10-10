# Etapa de construcción
FROM node:16 AS builder
WORKDIR /app
COPY . /app/
RUN yarn install && yarn build

# Etapa de ejecución
FROM nginx:alpine
# Configuración de la zona horaria
RUN apk add --no-cache tzdata
ENV TZ=America/Guayaquil
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Copia los archivos estáticos desde la etapa de construcción
COPY --from=builder /app/dist/david_tamayo_front /usr/share/nginx/html

# (Opcional) Copia la configuración personalizada de nginx
#COPY ./FrontEnd/default.conf /etc/nginx/conf.d/default.conf

# Inicio de nginx en primer plano
ENTRYPOINT ["nginx", "-g", "daemon off;"]