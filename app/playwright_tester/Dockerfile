FROM node:18-bullseye

WORKDIR /app/firegame

RUN npm install -g playwright \
  && playwright install --with-deps

COPY firegame/package.json ./
RUN npm install --no-package-lock

COPY firegame/ ./
COPY run_test.sh /app/firegame/run_test.sh

ENTRYPOINT ["bash", "/app/firegame/run_test.sh"]
