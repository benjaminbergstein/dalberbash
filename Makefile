BASE_DIR = .
include ${BASE_DIR}/shared.mk

build:
	make -C docker

start:
	make -C dev

stop:
	make -C dev undeploy
