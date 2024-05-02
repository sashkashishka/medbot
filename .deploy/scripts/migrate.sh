#! /bin/bash

tag=$TAG
dir=$DIR
env=$ENV

echo 'Apply migration';
docker compose -f $dir/.deploy/docker-compose.$env.yaml exec fastify_$env npm run prisma migrate deploy
