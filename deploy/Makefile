BASE_DIR = ..
include ${BASE_DIR}/shared.mk

.PHONY: deploy

deploy: start

start:
	${COMPOSE_CMD} up -d app

redeploy: undeploy deploy

undeploy:
	${COMPOSE_CMD} down --remove-orphans
