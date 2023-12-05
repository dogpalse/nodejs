FROM node:20.10.0-alpine

WORKDIR /app

COPY packge*.json ./

RUN npm install

COPY

ENTRYPOINT ["npm", "start"]
