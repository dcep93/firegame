#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="${SCRIPT_DIR}/firegame"
if [ ! -d "${APP_DIR}" ]; then
    APP_DIR="${SCRIPT_DIR}"
fi
PLAYWRIGHT_TEST_FILE="src/routes/catann/playwright_test.spec.ts"
PLAYWRIGHT_DEP="node_modules/.bin/playwright"

if [ -x "${APP_DIR}/${PLAYWRIGHT_DEP}" ]; then
    PLAYWRIGHT_BIN="${APP_DIR}/${PLAYWRIGHT_DEP}"
elif command -v playwright >/dev/null 2>&1; then
    PLAYWRIGHT_BIN="playwright"
else
    echo "Playwright is not installed. Use the Dockerfile or install dependencies locally."
    exit 1
fi

(cd "${APP_DIR}" && "${PLAYWRIGHT_BIN}" test "${PLAYWRIGHT_TEST_FILE}")
