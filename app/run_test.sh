#!/bin/bash

set -euo pipefail

TEST_CMD=("playwright" "test" "src/routes/catann/playwright_test.ts")

if [ "${1:-}" = "--docker" ]; then
    IMAGE_ID="$(docker build -q -f playwright_tester/Dockerfile .)"
    docker run --rm "${IMAGE_ID}"
else
    "${TEST_CMD[@]}"
fi
