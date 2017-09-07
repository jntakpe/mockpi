FROM nginx
MAINTAINER Jocelyn NTAKPE <https://github.com/jntakpe/mockpi>

ARG SERVER_ADDR=127.0.0.1

COPY fill_nginx_conf.sh /etc/nginx/fill_nginx_conf.sh
COPY nginx.conf /etc/nginx/nginx.conf
RUN /etc/nginx/fill_nginx_conf.sh $SERVER_ADDR
COPY dist /usr/share/nginx/html

EXPOSE 80