FROM node:22
WORKDIR /app

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

COPY ./resources ./resources
COPY ./src ./src
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json

RUN npm install

RUN npm run build

CMD npm run start