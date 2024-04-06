#! /bin/bash

tag=$TAG
dir=$DIR
env=$ENV

echo 'Stop previous';
docker compose -f ~/$dir/.deploy/docker-compose.yaml stop db_$env adminer_$env fastify_$env nginx_medbot_$env

echo 'Start db';
docker compose -f ~/$dir/.deploy/docker-compose.yaml up db_$env -d --wait

echo 'Start adminer';
docker compose -f ~/$dir/.deploy/docker-compose.yaml up adminer_$env -d --wait

echo 'Start fastify';
docker compose -f ~/$dir/.deploy/docker-compose.yaml up fastify_$env -d --wait

echo 'Start nginx';
docker compose -f ~/$dir/.deploy/docker-compose.yaml up nginx_medbot_$env -d --wait

