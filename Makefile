release:
	${MAKE} -C docker
	${MAKE} -C deploy undeploy deploy

