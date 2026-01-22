#!/bin/bash
set -e
set +x

git rev-parse head
cd app/firegame
cat package.json
yarn install
npx -y playwright install
npx -y playwright install-deps
