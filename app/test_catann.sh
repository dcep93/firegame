#!/bin/bash

set -xeuo pipefail


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
INIT_TIME_FILE="${INIT_TIME_FILE:-/tmp/catann_init_time}"

init_start_time() {
    date +%s >"$INIT_TIME_FILE"
}

print_elapsed_since_init() {
    local init_time
    init_time="$(cat "$INIT_TIME_FILE" 2>/dev/null || true)"
    if [[ ! "$init_time" =~ ^[0-9]+$ ]]; then
        init_start_time
        init_time="$(cat "$INIT_TIME_FILE")"
    fi
    local now elapsed minutes seconds
    now="$(date +%s)"
    if [ "$now" -lt "$init_time" ]; then
        init_start_time
        init_time="$(cat "$INIT_TIME_FILE")"
    fi
    elapsed=$((now - init_time))
    minutes=$((elapsed / 60))
    seconds=$((elapsed % 60))
    printf "%02d:%02d\n" "$minutes" "$seconds"
}

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
    fi
else
    print_elapsed_since_init
fi

/usr/bin/time -p npx playwright test src/routes/catann/test/playwright_test.spec.ts
