FROM node:20.12-alpine3.18
WORKDIR /app
COPY public/ /app/public
COPY src/ /app/src
COPY package.json /app/
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]


