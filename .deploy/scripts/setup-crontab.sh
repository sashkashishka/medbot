#!/bin/bash

tag=$TAG
dir=$DIR
env=$ENV

ENV_FILE="$dir/.deploy/.env.$env"
source "$ENV_FILE"

DB_DUMP_CMD="docker compose -f $dir/.deploy/docker-compose.$env.yaml exec db mysqldump -u $MYSQL_ROOT_USER -p\"$MYSQL_ROOT_PASSWORD\" $MYSQL_DATABASE > $dir/backup/db-$env-dump-\$(date +"%Y%m%d%H%M%S").sql"
DELETE_OLD_DUMPS="bash $dir/.deploy/scripts/delete_old_files.sh $dir/backup"

echo "" > jobs.$env.txt

echo "0 0 * * * $DB_DUMP_CMD" >> jobs.$env.txt
echo "0 0 * * 0 $DELETE_OLD_DUMPS" >> jobs.$env.txt

crontab jobs.$env.txt

echo "Cron job for $env env added successfully."

