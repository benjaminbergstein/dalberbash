BASE_DIR = .
include ${BASE_DIR}/shared.mk

.PHONY: setup

build:
	${MAKE} -C docker

start:
	${MAKE} -C dev

stop:
	${MAKE} -C dev undeploy

setup:
	${MAKE} -C setup
