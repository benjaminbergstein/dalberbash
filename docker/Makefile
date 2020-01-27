BASE_DIR = ..
include ${BASE_DIR}/shared.mk

TARGET ?= app
PROJECT_DIR ?= ${BASE_DIR}/${TARGET}

include ../shared.mk

all: build tag
build:
	docker build ${PROJECT_DIR} -t ${LATEST_IMAGE}

tag:
	docker tag ${LATEST_IMAGE} ${SHA_IMAGE}
	docker tag ${LATEST_IMAGE} ${BRANCH_IMAGE}

push-image:
	docker push ${IMAGE_NAME}
	docker push ${SHA_IMAGE}
	docker push ${BRANCH_IMAGE}
