#!/bin/bash

echo "<pre>"
pwd
cd "$( dirname "${BASH_SOURCE[0]}"/../../../ )"
pwd
npm run build 2>&1
code=$?
echo "$(date) $(pwd) $code built w"
echo "</pre>"
echo
