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

cd "$(dirname "${BASH_SOURCE[0]}")/firegame"

npx playwright test src/routes/catann/test/playwright_test.spec.ts
