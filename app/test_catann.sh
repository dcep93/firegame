#!/bin/bash

set -euo pipefail


# the codex environment is defined by the CODEX_HOME env var
# this script should be called with the --codex flag if and only if this is run in the codex environment

HAS_CODEX_FLAG=0
for arg in "$@"; do
    if [ "$arg" = "--codex" ]; then
        HAS_CODEX_FLAG=1
        break
    fi
done
CODEX_HOME_IS_SET=$([ -n "${CODEX_HOME:-}" ] && echo 1 || echo 0)
if [ "$HAS_CODEX_FLAG" -ne "$CODEX_HOME_IS_SET" ]; then
    echo "This script must be called via app/skills/test_catann.md"
    exit 1
fi

PLAYWRIGHT_ARGS=(test "src/routes/catann/playwright_test.spec.ts" "$@")

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="${SCRIPT_DIR}/firegame"
if [ ! -d "${APP_DIR}" ]; then
    APP_DIR="${SCRIPT_DIR}"
fi
PLAYWRIGHT_DEP="node_modules/.bin/playwright"

if [ -x "${APP_DIR}/${PLAYWRIGHT_DEP}" ]; then
    PLAYWRIGHT_BIN="${APP_DIR}/${PLAYWRIGHT_DEP}"
elif command -v playwright >/dev/null 2>&1; then
    PLAYWRIGHT_BIN="playwright"
else
    echo "Playwright is not installed. Use the Dockerfile or install dependencies locally."
    exit 1
fi

(cd "${APP_DIR}" && "${PLAYWRIGHT_BIN}" "${PLAYWRIGHT_ARGS[@]}")
