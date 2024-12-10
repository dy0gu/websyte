FROM node:22

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

ENTRYPOINT ["npm", "run", "start"]