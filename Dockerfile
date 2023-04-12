FROM node:16-alpine

WORKDIR /app

COPY / ./

RUN yarn install
RUN yarn build
RUN yarn swagger

EXPOSE 3000

CMD yarn start
