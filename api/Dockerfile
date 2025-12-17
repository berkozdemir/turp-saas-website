FROM php:8.2-apache

# Gerekli sistem paketlerini ve PHP eklentilerini kur
RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev \
    pkg-config \
    && docker-php-ext-install pdo pdo_mysql curl \
    && a2enmod rewrite

# Çalışma dizinini ayarla
WORKDIR /var/www/html/

# Dosyaları kopyala
COPY . /var/www/html/

# Apache portunu aç
EXPOSE 80
