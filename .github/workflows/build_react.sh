#!/bin/bash

set -euo pipefail

cd app/firegame
yarn install --immutable
yarn test --watchAll=false
yarn build
rm -rf node_modules
