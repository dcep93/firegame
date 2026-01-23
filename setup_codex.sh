#!/bin/bash
set -xe

date
git rev-parse HEAD
CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
echo $CODEX_HOME
SKILLS_DIR="${CODEX_HOME}/skills"
ln -sfn "$(pwd)/.codex/skills" "${SKILLS_DIR}"
cd app/firegame
cat package.json
yarn install
npx -y playwright install
npx -y playwright install-deps
date
