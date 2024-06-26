#! /bin/bash

tag=$TAG
imagesDir=$IMAGES_DIR
dir=$DIR
env=$ENV

echo 'Load images';
docker load -i $imagesDir/fastify.tar

echo 'Stop previous';
docker compose -f $dir/docker-compose.yaml stop db_$env adminer_$env fastify_$env

echo 'Start db';
docker compose -f $dir/docker-compose.yaml up db_$env -d --wait

echo 'Start adminer';
docker compose -f $dir/docker-compose.yaml up adminer_$env -d --wait

echo 'Start fastify';
docker compose -f $dir/docker-compose.yaml up fastify_$env -d --wait
