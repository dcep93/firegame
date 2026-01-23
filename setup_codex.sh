#!/bin/bash
set -xe

date
echo $CODEX_HOME
SKILLS_DIR="${CODEX_HOME}/skills"
mkdir -p "${CODEX_HOME}"
ln -sfn "$(pwd)/.codex/skills" "${SKILLS_DIR}"
# git rev-parse HEAD
# cd app/firegame
# cat package.json
# yarn install
# npx -y playwright install
# npx -y playwright install-deps
# date
