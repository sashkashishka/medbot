FROM nginx:1.25.3

WORKDIR /usr/app

COPY ./admin/build ./admin
COPY ./webapp/build ./webapp
