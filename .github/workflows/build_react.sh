#!/bin/bash
cd firegame || exit
yarn install
yarn build
rm -rf node_modules
du -h -d2 .
