export PROJECT ?= dalberbash
export APP_ENV ?= development

DOCKER_REPO ?= benbergstein
IMAGE_BASE_NAME = ${DOCKER_REPO}/${PROJECT}
GIT_SHA = $(shell git rev-parse --short=7 HEAD)
GIT_BRANCH = $(shell git rev-parse --abbrev-ref HEAD)

export LATEST_IMAGE = ${IMAGE_BASE_NAME}:latest
export SHA_IMAGE = ${IMAGE_BASE_NAME}:${GIT_SHA}
export BRANCH_IMAGE = ${IMAGE_BASE_NAME}:${GIT_BRANCH}
export DOCKER_IMAGE ?= ${LATEST_IMAGE}
export DOCKER_COMPOSE_PROJECT=${PROJECT}-${APP_ENV}

include ${BASE_DIR}/${APP_ENV}.mk

define COMPOSE_CMD
docker-compose --project-directory ${BASE_DIR} -p ${DOCKER_COMPOSE_PROJECT}
endef
