#!/bin/bash

echo "<pre>"
pwd
cd "$( dirname "${BASH_SOURCE[0]}"/../../../ )"
pwd
cd /home/dcep93_2020/firegame/firegame
pwd
npm run build 2>&1
code=$?
echo "$(date) $(pwd) $code built w"
echo "</pre>"
echo
