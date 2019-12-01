FROM node:latest

WORKDIR /app

ADD package.json /app
RUN yarn

ADD . /app

CMD ["yarn", "start"]
