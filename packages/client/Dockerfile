FROM node:current-slim

ENV APP_DIR /app/
WORKDIR ${APP_DIR}

COPY . ./
RUN yarn install

ENV HOST 0.0.0.0

EXPOSE 3000

CMD ["yarn", "dev"]