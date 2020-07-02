FROM node:alpine

WORKDIR /usr/src/app

COPY . .
RUN yarn

EXPOSE 5000

CMD ["yarn", "start:dev"]

