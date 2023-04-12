FROM node:gallium-bullseye

WORKDIR /vkr/front

RUN npm install -g http-server

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8080
CMD http-server dist