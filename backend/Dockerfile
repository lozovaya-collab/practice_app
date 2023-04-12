FROM node:16-alpine

WORKDIR /term-back

COPY / ./

RUN yarn install
RUN yarn build
RUN yarn swagger

EXPOSE 3000

CMD yarn start
