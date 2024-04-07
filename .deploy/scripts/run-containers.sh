#! /bin/bash

tag=$TAG
imagesDir=$IMAGES_DIR
dir=$DIR
env=$ENV

echo 'Load images';
docker load -i $imagesDir/fastify.tar
docker load -i $imagesDir/nginx.tar

echo 'Stop previous';
docker compose -f $dir/.deploy/docker-compose.$env.yaml stop 

echo 'Start db';
docker compose -f $dir/.deploy/docker-compose.$env.yaml up db -d --wait

echo 'Start adminer';
docker compose -f $dir/.deploy/docker-compose.$env.yaml up adminer -d --wait

echo 'Start fastify';
docker compose -f $dir/.deploy/docker-compose.$env.yaml up fastify -d --wait

echo 'Start nginx';
docker compose -f $dir/.deploy/docker-compose.$env.yaml up nginx -d --wait

