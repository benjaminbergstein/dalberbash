BASE_DIR = ..
include ${BASE_DIR}/shared.mk

.PHONY: deploy

deploy: start

start:
	${COMPOSE_CMD} up -d server

redeploy: undeploy deploy

undeploy:
	${COMPOSE_CMD} down --remove-orphans

shell:
	${COMPOSE_CMD} run --entrypoint /bin/bash server
