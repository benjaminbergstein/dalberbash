export APP_ENV=production
export REACT_APP_HOST=https://www.dalberbash.com

BASE_DIR = ..
include ${BASE_DIR}/shared.mk

.PHONY: deploy

release:
	${MAKE} -C ../docker
	${MAKE} undeploy deploy

deploy: start build

start:
	${COMPOSE_CMD} up -d app

build:
	${COMPOSE_CMD} exec app yarn build

redeploy: undeploy deploy

undeploy:
	${COMPOSE_CMD} down --remove-orphans
