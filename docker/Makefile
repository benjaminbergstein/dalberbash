export PROJECT=webrtc-learning
export IMAGE_NAME = benbergstein/${PROJECT}:latest

all: build
build:
	docker build .. -t ${IMAGE_NAME}

push-image:
	docker push ${IMAGE_NAME}
