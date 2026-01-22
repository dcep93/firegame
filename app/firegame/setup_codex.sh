#!/bin/bash
set -e

yarn install
npx -y playwright install
npx -y playwright install-deps
