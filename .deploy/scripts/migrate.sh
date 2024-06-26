#! /bin/bash

tag=$TAG
dir=$DIR
env=$ENV

echo 'Apply migration';
docker compose -f $dir/docker-compose.yaml exec fastify_$env npm run prisma migrate deploy
