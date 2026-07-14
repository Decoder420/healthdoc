# HealthDoc dev commands — run from repo root
COMPOSE := docker compose -f infra/docker-compose.yml --env-file .env

.PHONY: setup up down logs ps migrate revision test lint fe be certs

setup:            ## First-time setup: .env, certs, build, start, migrate
	./scripts/dev_setup.sh

up:               ## Start the full stack
	$(COMPOSE) up -d

down:             ## Stop the stack (data volumes kept)
	$(COMPOSE) down

logs:             ## Tail all logs
	$(COMPOSE) logs -f --tail=100

ps:
	$(COMPOSE) ps

migrate:          ## Apply DB migrations
	$(COMPOSE) exec backend alembic upgrade head

revision:         ## New migration: make revision m="add foo table"
	$(COMPOSE) exec backend alembic revision --autogenerate -m "$(m)"

test:             ## Backend tests
	$(COMPOSE) exec backend pytest -q

lint:             ## Lint backend + frontend
	$(COMPOSE) exec backend ruff check .
	$(COMPOSE) exec frontend npm run lint

certs:
	./infra/nginx/generate-dev-certs.sh
