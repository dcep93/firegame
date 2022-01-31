#!/bin/bash

set -euo pipefail

filename=recorded_sha.tsx

cd firegame/src
test -f "$filename"
printf "export const recorded_sha = \`%s\n%s\`;\n" "$(TZ='America/Los_Angeles' date)" "$(git log -1)" > "$filename"
