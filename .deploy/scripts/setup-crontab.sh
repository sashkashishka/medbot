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

STAGE_DB_DUMP_CMD="bash $dir/scripts/dump.sh $dir stage $stage_db_user $stage_db_pass $stage_db_name"
PROD_DB_DUMP_CMD="bash $dir/scripts/dump.sh $dir prod $prod_db_user $prod_db_pass $prod_db_name"
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

