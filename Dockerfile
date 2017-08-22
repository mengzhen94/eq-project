# https://hub.docker.com/_/node/
FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app/
RUN npm install --silent
RUN npm run build
