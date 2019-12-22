define COMPOSE_CMD
docker-compose --project-directory .. -p dalberbash-prod
endef

.PHONY: deploy

build:
	${COMPOSE_CMD} exec \
		-e REACT_APP_HOST=http://dalberbash.benjaminbergstein.com \
		app yarn build

start:
	${COMPOSE_CMD} up -d app

deploy: start build
redeploy: undeploy deploy

undeploy:
	${COMPOSE_CMD} down --remove-orphans
