#!/bin/bash

dir=$DIR

db_user="MYSQL_ROOT_USER"
db_pass="MYSQL_ROOT_PASSWORD"
db_name="MYSQL_DATABASE"

stage_db_user=$(grep "^$db_user=" "$dir/.deploy/.env.stage" | cut -d '=' -f 2)
prod_db_user=$(grep "^$db_user=" "$dir/.deploy/.env.prod" | cut -d '=' -f 2)

stage_db_pass=$(grep "^$db_pass=" "$dir/.deploy/.env.stage" | cut -d '=' -f 2)
prod_db_pass=$(grep "^$db_pass=" "$dir/.deploy/.env.prod" | cut -d '=' -f 2)

stage_db_name=$(grep "^$db_name=" "$dir/.deploy/.env.stage" | cut -d '=' -f 2)
prod_db_name=$(grep "^$db_name=" "$dir/.deploy/.env.prod" | cut -d '=' -f 2)

STAGE_DB_DUMP_CMD="docker compose -f $dir/.deploy/docker-compose.yaml exec db_stage mysqldump -u $stage_db_user -p\"$stage_db_pass\" $stage_db_name > $dir/backup/db-stage-dump-\$(date +"%Y%m%d%H%M%S").sql"
PROD_DB_DUMP_CMD="docker compose -f $dir/.deploy/docker-compose.yaml exec db_prod mysqldump -u $prod_db_user -p\"$prod_db_pass\" $prod_db_name > $dir/backup/db-prod-dump-\$(date +"%Y%m%d%H%M%S").sql"
DELETE_OLD_DUMPS="bash $dir/.deploy/scripts/delete_old_files.sh $dir/backup"
DELETE_OLD_FASTIFY_IMAGES="bash $dir/.deploy/scripts/delete_old_docker_images.sh medbot/fastify"

echo "" > jobs.txt

echo "0 0 * * * $STAGE_DB_DUMP_CMD" >> jobs.txt
echo "0 0 * * * $PROD_DB_DUMP_CMD" >> jobs.txt
echo "0 0 * * 0 $DELETE_OLD_DUMPS" >> jobs.txt
echo "0 0 * * 0 $DELETE_OLD_FASTIFY_IMAGES" >> jobs.txt

crontab jobs.txt

echo "Cron job for added successfully."

