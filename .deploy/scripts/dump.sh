#!/bin/bash

timestamp=$(date +"%Y%m%d%H%M%S")

dir="$1"
env="$2"
user="$3"
pass="$4"
db="$5"

docker compose -f $dir/docker-compose.yaml exec db_$env mysqldump -u $user -p$pass $db > $dir/$env/backup/db-dump-$timestamp.sql
