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

APP_URL="http://127.0.0.1:3000"
LOG_FILE="${LOG_FILE:-/tmp/catann_yarn_start.log}"

is_server_alive() {
    curl --silent --fail --max-time 2 "$APP_URL" >/dev/null 2>&1
}

wait_for_server() {
    local timeout_seconds="${1:-60}"
    local start_time
    start_time="$(date +%s)"
    while true; do
        if is_server_alive; then
            return 0
        fi
        local now
        now="$(date +%s)"
        if [ $((now - start_time)) -ge "$timeout_seconds" ]; then
            echo "Timed out waiting for server at $APP_URL"
            return 1
        fi
        sleep 1
    done
}

if [ "$HAS_CODEX_FLAG" -eq 0 ]; then
    if ! is_server_alive; then
        echo "Starting yarn start (logs: $LOG_FILE)..."
        nohup yarn start >"$LOG_FILE" 2>&1 &
        wait_for_server 60
    else
        echo "Server already running at $APP_URL"
    fi
fi

npx playwright test src/routes/catann/test/playwright_test.spec.ts
