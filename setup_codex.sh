#!/bin/bash
set -xe

date
apt-get update
apt-get install -y time
ln -sfn "$(pwd)/.codex/skills" "/opt/codex/skills"
git rev-parse HEAD
cd app/firegame
cat package.json
yarn install
npx -y playwright install
npx -y playwright install-deps
date
