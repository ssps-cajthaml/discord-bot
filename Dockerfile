FROM node:16-alpine
WORKDIR /app

COPY ./resources ./resources
COPY ./src ./src
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json

RUN npm install

RUN npm run build

CMD npm run start
