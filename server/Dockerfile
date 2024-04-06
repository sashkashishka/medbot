FROM node:21.7.2-alpine

WORKDIR /usr/app

COPY package.json .
COPY package-lock.json .

RUN npm ci --omit=dev

COPY build/src .
COPY prisma prisma

CMD ["node", "index.js"]
