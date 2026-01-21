#!/bin/bash

set -euo pipefail

IMAGE_NAME="firegame-playwright-tester"
TEST_CMD=("playwright" "test" "src/routes/catann/playwright_test.ts")

if [ "${1:-}" = "--docker" ]; then
    docker build -f playwright_tester/Dockerfile -t "${IMAGE_NAME}" .
    docker run --rm "${IMAGE_NAME}"
else
    "${TEST_CMD[@]}"
fi
