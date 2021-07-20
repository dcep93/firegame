#!/bin/bash
set -euo pipefail

cd firegame || exit
npm install
yarn build
rm -rf node_modules
du -h -d3 . | sort -h
