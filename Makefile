# Configurable variables
IMAGE ?= todo-sorter:latest
PORT ?= 3001
CONTAINER_NAME ?= todo-sorter

.PHONY: $(shell sed -n -e '/^$$/ { n ; /^[^ .\#][^ ]*:/ { s/:.*$$// ; p ; } ; }' $(MAKEFILE_LIST))

help:
	 @echo "$$(grep -hE '^\S+:.*##' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\\x1b[36m\1\\x1b[m:\2/' | column -c2 -t -s :)"

build: ## Install dependencies
	npm install

test: build ## Run tests
	npm test

run: build ## Start the service locally (uses PORT env if set)
	npm start

build-docker: ## Build Docker image
	docker build -t $(IMAGE) .


run-docker: build-docker ## Build and run container
	docker run --rm -p $(PORT):$(PORT) -e PORT=$(PORT) --name $(CONTAINER_NAME) $(IMAGE)
