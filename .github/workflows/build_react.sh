#!/bin/bash

set -euo pipefail

cd app
npm install
yarn build
rm -rf node_modules
