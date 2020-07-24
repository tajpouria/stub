FROM node:alpine

WORKDIR /usr/src/app

COPY . .
RUN yarn

EXPOSE 6000

CMD ["yarn", "start:dev"]

