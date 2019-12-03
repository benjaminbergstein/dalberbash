FROM node:latest

WORKDIR /app

ADD package.json /app
RUN yarn

ADD . /app

ENTRYPOINT ["yarn"]
CMD ["start"]