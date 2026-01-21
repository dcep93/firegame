#!/bin/bash

set -euo pipefail

alias run_test="playwright test src/routes/catann/playwright_test.ts"

if : "$1" == "--docker" ; then
    docker build . -f playwright_tester/Dockerfile
    docker run . 
else
    run_test
fi
