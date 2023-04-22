FROM node:16-alpine

WORKDIR /vkr/front

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build