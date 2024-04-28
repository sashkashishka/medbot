FROM node:21.7.2-alpine

RUN apk add --update \
  curl \
  && rm -rf /var/cache/apk/*

WORKDIR /usr/app

COPY package.json .
COPY package-lock.json .

RUN npm ci --omit=dev

COPY build/src .
COPY prisma prisma

RUN npm run prisma generate
RUN mkdir -p logs/fastify

CMD ["node", "index.js"]
