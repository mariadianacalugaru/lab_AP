FROM node:20.12-alpine3.18
WORKDIR /app
COPY public/ /app/public
COPY package.json /app/
RUN npm install --f
EXPOSE 3000
CMD ["npm", "start"]
