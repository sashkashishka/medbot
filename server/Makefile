start:
	docker compose -f docker-compose.dev.yaml up

build_app:
	docker compose -f docker-compose.dev.yaml build

build_nocache:
	docker compose -f docker-compose.dev.yaml build --no-cache

exec_app_sh:
	docker compose -f docker-compose.dev.yaml exec -it app /bin/sh

restart_app:
	docker compose -f docker-compose.dev.yaml restart app

migration_name = init

migrate_dev:
	docker compose -f docker-compose.dev.yaml exec app npm run prisma migrate dev --name $(migration_name) 


start_test_db:
	docker compose -f docker-compose.testing.yaml up
