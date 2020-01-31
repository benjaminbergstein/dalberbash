BASE_DIR = .
include ${BASE_DIR}/shared.mk

.PHONY: setup

build:
	${MAKE} -C docker

start:
	${MAKE} -C dev

stop:
	${MAKE} -C dev undeploy

logs:
	${MAKE} -C dev logs

setup:
	${MAKE} -C setup
