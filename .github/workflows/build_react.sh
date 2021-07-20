#!/bin/bash

set -euo pipefail

cd firegame
npm install
yarn build
rm -rf node_modules
