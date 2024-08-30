FROM node:18

WORKDIR /myapp
COPY package.json .
RUN npm install
RUN npm install bcryptjs jsonwebtoken cors

EXPOSE 3000

COPY . .

CMD npm start