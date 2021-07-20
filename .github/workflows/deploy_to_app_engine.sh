#!/bin/bash

set -euo pipefail

export GOOGLE_APPLICATION_CREDENTIALS="gac.json"
echo "$1" > "$GAC"
gcloud app deploy
