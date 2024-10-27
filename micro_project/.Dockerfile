FROM node:22-alpine

RUN apk add --no-cache bash

WORKDIR /app

COPY . .
COPY ./proto/build ./proto/build

RUN npm i

EXPOSE 5000
CMD [  "bash", "-c", "npm run start:dev" ]