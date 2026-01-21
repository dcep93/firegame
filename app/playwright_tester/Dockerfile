FROM node:18-bullseye

WORKDIR /app/firegame

RUN npm install -g playwright \
  && playwright install --with-deps

RUN corepack enable

COPY firegame/package.json firegame/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY firegame/ ./

ENV CI=true

RUN playwright test src/routes/catann/playwright_test.ts
