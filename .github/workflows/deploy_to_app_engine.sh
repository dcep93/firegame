#!/bin/bash

set -euo pipefail

GAC="gac.json"
echo "$1" > "$GAC"
cat "$GAC" | tail
