#!/bin/bash

set -euo pipefail

cd app/firegame
npm install
yarn build
rm -rf node_modules
