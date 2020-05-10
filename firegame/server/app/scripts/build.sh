#!/bin/bash

cd "$( dirname "${BASH_SOURCE[0]}"/../../../ )"
echo "<pre>"
npm run build 2>&1
code=$?
echo "$(date) $code built"
echo "</pre>"
echo
