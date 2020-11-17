FROM node:latest

RUN mkdir /app
WORKDIR /app
ADD . .

RUN npm install