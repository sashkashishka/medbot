start:
	docker compose -f docker-compose.dev.yaml up

build:
	docker compose -f docker-compose.dev.yaml build

exec_app_sh:
	docker compose -f docker-compose.dev.yaml exec -it app /bin/sh

restart_app:
	docker compose -f docker-compose.dev.yaml restart app

migration_name = init

migrate_dev:
	docker compose -f docker-compose.dev.yaml exec app npm run prisma migrate dev --name $(migration_name) 
