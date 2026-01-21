FROM node:18-bullseye

WORKDIR /app/firegame

RUN npm install -g playwright \
  && playwright install --with-deps chromium

COPY firegame/package.json firegame/package-lock.json ./
RUN npm ci

COPY firegame/ ./
COPY run_test.sh /app/firegame/run_test.sh

ENTRYPOINT ["bash", "/app/firegame/run_test.sh"]
