from nginx:1.17

ADD build /var/www/html
ADD nginx-prod.conf /etc/nginx/conf.d/default.conf