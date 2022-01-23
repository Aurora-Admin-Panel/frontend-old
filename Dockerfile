from nginx:1.20-alpine

ADD build /var/www/html
ADD nginx-prod.conf /etc/nginx/conf.d/default.conf
