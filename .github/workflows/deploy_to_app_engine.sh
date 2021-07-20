#!/bin/bash

set -euo pipefail

GAC="gac.json"
echo "$1" > "$GAC"
cat "$GAC"
apt-get install jq
cat "$GAC" | jq
