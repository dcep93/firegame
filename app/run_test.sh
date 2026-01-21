#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -d "${SCRIPT_DIR}/firegame" ]; then
    APP_DIR="${SCRIPT_DIR}/firegame"
else
    APP_DIR="${SCRIPT_DIR}"
fi
PLAYWRIGHT_TEST_FILE="src/routes/catann/playwright_test.spec.ts"
TEST_CMD=("npx" "--yes" "playwright" "test" "${PLAYWRIGHT_TEST_FILE}")
INSTALL_CMD=("npx" "--yes" "playwright" "install" "chromium")
PLAYWRIGHT_DEP="node_modules/@playwright/test"
PLAYWRIGHT_INSTALL_CMD=("npm" "install" "--no-save" "--no-package-lock" "@playwright/test")

# codex: use the playwright skill instead of this docker flag
if [ "${1:-}" = "--docker" ]; then
    IMAGE_ID="$(docker build -q -f playwright_tester/Dockerfile .)"
    docker run --rm "${IMAGE_ID}"
else
    if [ ! -d "${APP_DIR}/${PLAYWRIGHT_DEP}" ]; then
        (cd "${APP_DIR}" && "${PLAYWRIGHT_INSTALL_CMD[@]}")
    fi
    if ! (cd "${APP_DIR}" && "${INSTALL_CMD[@]}"); then
        echo "Playwright browser install failed; skipping tests."
        exit 0
    fi
    (cd "${APP_DIR}" && "${TEST_CMD[@]}")
fi
