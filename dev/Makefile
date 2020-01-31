BASE_DIR = ..
include ${BASE_DIR}/shared.mk

SERVICE ?= app

.PHONY: deploy

deploy: start

start:
	${COMPOSE_CMD} up -d ${SERVICE}

redeploy: undeploy deploy

undeploy:
	${COMPOSE_CMD} down --remove-orphans

shell:
	${COMPOSE_CMD} run --entrypoint /bin/bash ${SERVICE}

console:
	${COMPOSE_CMD} exec ${SERVICE} /bin/bash

logs:
	${COMPOSE_CMD} logs -f
