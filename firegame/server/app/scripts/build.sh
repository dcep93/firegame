#!/bin/bash

cd "$( dirname "${BASH_SOURCE[0]}"/../../../ )"
echo "<pre>"
npm run build 2>&1
code=$?
echo "$(date) $(pwd) $code built"
echo "</pre>"
echo
