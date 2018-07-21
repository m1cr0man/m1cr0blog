FROM node:alpine

MAINTAINER Lucas Savva "lucas@m1cr0man.com"
LABEL author "Lucas Savva lucas@m1cr0man.com"
LABEL repo "https://github.com/m1cr0man/m1cr0blog"
ARG VERSION=1.0.0
ARG SHA=unknown
ARG NODE_ENV=production
LABEL version=$VERSION sha=$SHA env=$NODE_ENV

COPY package*.json /opt/m1cr0blog/

WORKDIR /opt/m1cr0blog

RUN mkdir node_modules && npm install

COPY . /opt/m1cr0blog

RUN mkdir storage && npm run build

VOLUME /opt/m1cr0blog/storage

EXPOSE 3000

ENTRYPOINT npm run start

HEALTHCHECK --interval=15s --timeout=1s --retries=3 CMD curl -so /dev/null http://127.0.0.1/ 3000
