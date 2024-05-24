# docker file
FROM node:18-slim

WORKDIR /myapp
COPY package.json .
RUN npm install
RUN npm install express mysql2 dotenv


COPY . .
CMD npm start