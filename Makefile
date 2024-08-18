# Detect the operating system
OS := $(shell uname -s)

COMMIT_MSG ?= no message update
BRANCH_NAME ?= main
PARAMS ?= "--ff-only"
DATA_SCHEMA ?= "" 
DOCKER_COMPOSE= docker compose
DJANGO_MANAGE= $(DOCKER_COMPOSE) exec backend python manage.py
.DEFAULT_GOAL := update

# Docker related commands
.PHONY: run
run:
	$(DOCKER_COMPOSE) up -d

.PHONY: build
build: 
	$(DOCKER_COMPOSE) up -d --build

.PHONY: build_no_cache
build_no_cache:
	$(DOCKER_COMPOSE) up -d --build --no-cache

.PHONY:down
down: 
	$(DOCKER_COMPOSE) down

.PHONY: clean_docker
clean_docker:
	$(DOCKER_COMPOSE) down --rmi all --volumes --remove-orphans

# Django backend related commands
.PHONY: venv
venv:
	python -m venv .venv
ifeq ($(OS),Windows_NT)
	source .venv/Scripts/activate
else
	source .venv/bin/activate
endif
	pip install -r ./backend/requirements.txt
	cd frontend
	npm install
	cd ..

.PHONY: migrate
migrate:
	$(DJANGO_MANAGE) migrate

.PHONY: makemigrations
makemigrations:
	$(DJANGO_MANAGE) makemigrations $(DATA_SCHEMA)

.PHONY: showmigrations
showmigrations:
	$(DJANGO_MANAGE) showmigrations

.PHONY: createsuperuser
createsuperuser:
	$(DJANGO_MANAGE) createsuperuser

# General git hub commands
.PHONY:update_from_branch
update_from_branch:
	git stash
	git pull origin $(BRANCH_NAME) $(PARAMS)
	git stash pop

.PHONY: push_to_branch
push_to_branch: 
	git stash;
	git pull origin $(BRANCH_NAME) $(PARAMS)
	git stash pop;
	git add .
	git commit -m "$(COMMIT_MSG)"
	git push origin $(BRANCH_NAME)


# General update recipies
.PHONY: update
update:
	git stash
	git pull $(PARAMS)
	git stash pop

.PHONY: update_run
update_run:
	git stash
	git pull $(PARAMS)
	git stash pop
	$(MAKE) run
	$(MAKE) migrate

.PHONY: push
push: 
	git stash
	git pull $(PARAMS)
	git stash pop
	git add .
	git commit -m "$(COMMIT_MSG)"
	git push

# Combined migration and update target
.PHONY: migrate_and_update
migrate_and_update: update makemigrations migrate 

# Local recipies
.PHONY: run_local
run_local:
	cd frontend
	npm run dev
