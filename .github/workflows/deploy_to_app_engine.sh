#!/bin/bash

set -euo pipefail

cd firegame/server
export GOOGLE_APPLICATION_CREDENTIALS="gac.json"
echo "$1" > "$GAC"
gcloud app deploy
