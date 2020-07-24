FROM node:alpine

WORKDIR /usr/src/app

COPY . .
RUN yarn

EXPOSE 7000

CMD ["yarn", "start:dev"]

