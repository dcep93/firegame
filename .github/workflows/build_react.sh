#!/bin/bash

set -euo pipefail

exit 0
cd firegame || exit
npm install
yarn build
rm -rf node_modules
