#!/bin/bash
set -xe

date
git rev-parse HEAD
cd app/firegame
cat package.json
yarn install
npx -y playwright install
npx -y playwright install-deps
date
