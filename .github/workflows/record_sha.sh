#!/bin/bash

set -euo pipefail

filename=recorded_sha.tsx

cd firegame/src
test -f "$filename"
printf "const recorded_sha = \`%s\n%s\`;\nexport default recorded_sha;\n" "$(TZ='America/Los_Angeles' date)" "$(git log -1)" > "$filename"
