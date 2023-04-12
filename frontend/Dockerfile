FROM node:alpine

# ARG VUE_APP_BACKEND
# ENV VUE_APP_BACKEND ${VUE_APP_BACKEND}

WORKDIR /frontend

COPY / ./

EXPOSE 3000

RUN yarn install --frozen-lockfile
RUN yarn build
# CMD npm run start
# RUN npm i -g serve
# CMD serve -s ./build