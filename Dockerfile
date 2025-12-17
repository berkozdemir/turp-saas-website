# 1. Build Stage
FROM node:20-alpine as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# 2. Production Stage
FROM nginx:stable-alpine as production-stage

# Nginx konfigürasyonunu kopyala (Gerekirse özel konfigürasyon eklenebilir)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
