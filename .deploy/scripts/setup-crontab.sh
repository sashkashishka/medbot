#!/bin/bash

dir=$DIR

db_user="MYSQL_ROOT_USER"
db_pass="MYSQL_ROOT_PASSWORD"
db_name="MYSQL_DATABASE"

stage_db_user=$(grep "^$db_user=" "$dir/stage/.env" | cut -d '=' -f 2)
prod_db_user=$(grep "^$db_user=" "$dir/prod/.env" | cut -d '=' -f 2)

stage_db_pass=$(grep "^$db_pass=" "$dir/stage/.env" | cut -d '=' -f 2)
prod_db_pass=$(grep "^$db_pass=" "$dir/prod/.env" | cut -d '=' -f 2)

stage_db_name=$(grep "^$db_name=" "$dir/stage/.env" | cut -d '=' -f 2)
prod_db_name=$(grep "^$db_name=" "$dir/prod/.env" | cut -d '=' -f 2)

STAGE_DB_DUMP_CMD="docker compose -f $dir/docker-compose.yaml exec db_stage mysqldump -u $stage_db_user -p\"$stage_db_pass\" $stage_db_name > $dir/stage/backup/db-dump-\$(date +"%Y%m%d%H%M%S").sql"
PROD_DB_DUMP_CMD="docker compose -f $dir/docker-compose.yaml exec db_prod mysqldump -u $prod_db_user -p\"$prod_db_pass\" $prod_db_name > $dir/prod/backup/db-dump-\$(date +"%Y%m%d%H%M%S").sql"
STAGE_DELETE_OLD_DUMPS="bash $dir/scripts/delete_old_files.sh $dir/stage/backup"
PROD_DELETE_OLD_DUMPS="bash $dir/scripts/delete_old_files.sh $dir/prod/backup"
DELETE_OLD_FASTIFY_IMAGES="bash $dir/scripts/delete_old_docker_images.sh medbot/fastify"

echo "" > jobs.txt

echo "0 0 * * * $STAGE_DB_DUMP_CMD" >> jobs.txt
echo "0 0 * * * $PROD_DB_DUMP_CMD" >> jobs.txt
echo "0 0 * * 0 $STAGE_DELETE_OLD_DUMPS" >> jobs.txt
echo "0 0 * * 0 $PROD_DELETE_OLD_DUMPS" >> jobs.txt
echo "0 0 * * 0 $DELETE_OLD_FASTIFY_IMAGES" >> jobs.txt

crontab jobs.txt

echo "Cron job for added successfully."

