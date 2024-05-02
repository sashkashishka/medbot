#!/bin/bash

tag=$TAG
dir=$DIR
env=$ENV

ENV_FILE="$dir/.deploy/.env.$env"
source "$ENV_FILE"

DB_DUMP_CMD="docker compose -f $dir/.deploy/docker-compose.yaml exec db_$env mysqldump -u $MYSQL_ROOT_USER -p\"$MYSQL_ROOT_PASSWORD\" $MYSQL_DATABASE > $dir/backup/db-$env-dump-\$(date +"%Y%m%d%H%M%S").sql"
DELETE_OLD_DUMPS="bash $dir/.deploy/scripts/delete_old_files.sh $dir/backup"
DELETE_OLD_FASTIFY_IMAGES="bash $dir/.deploy/scripts/delete_old_docker_images.sh medbot/fastify"

echo "" > jobs.$env.txt

echo "0 0 * * * $DB_DUMP_CMD" >> jobs.$env.txt
echo "0 0 * * 0 $DELETE_OLD_DUMPS" >> jobs.$env.txt
echo "0 0 * * 0 $DELETE_OLD_FASTIFY_IMAGES" >> jobs.$env.txt

crontab jobs.$env.txt

echo "Cron job for $env env added successfully."

