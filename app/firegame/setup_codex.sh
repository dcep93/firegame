#!/bin/bash
set -e

yarn install
npx playwright install
npx playwright install-deps
