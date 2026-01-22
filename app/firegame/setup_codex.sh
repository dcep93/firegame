#!/bin/bash
set -e
set +x

echo 5
git rev-parse HEAD
cd app/firegame
cat package.json
yarn install
npx -y playwright install
npx -y playwright install-deps
