FROM node:latest

WORKDIR /app

ADD package.json /app
RUN yarn

EXPOSE 3000
EXPOSE 3001

ADD . /app

ENTRYPOINT ["yarn"]
CMD ["start"]
