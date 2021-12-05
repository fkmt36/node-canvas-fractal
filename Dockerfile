FROM node:17.2.0

RUN apt-get update

RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

WORKDIR /app

COPY package*.json .

RUN npm install

COPY src ./src

CMD npm run start