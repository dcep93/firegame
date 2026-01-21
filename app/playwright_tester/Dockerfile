FROM node:18-bullseye

WORKDIR /app/firegame

RUN npm install -g playwright \
  && playwright install --with-deps

RUN corepack enable

COPY firegame/package.json ./
RUN yarn install --frozen-lockfile

COPY firegame/ ./
COPY run_test.sh /app/firegame/run_test.sh

ENTRYPOINT ["bash", "/app/firegame/run_test.sh"]
