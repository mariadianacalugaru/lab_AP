FROM node:20.12.1-alpine3.18

WORKDIR /app

COPY ./angular-docker /app

RUN npm install -g @angular/cli

RUN npm install

CMD ["ng", "serve", "--host", "0.0.0.0","--port","3000"]