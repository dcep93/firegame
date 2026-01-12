#!/bin/bash

set -euo pipefail

cd app/firegame
npm install
npm test -- --watchAll=false
yarn build
rm -rf node_modules
