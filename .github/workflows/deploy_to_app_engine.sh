#!/bin/bash

set -euo pipefail

# app.yaml
# runtime: nodejs14

# App Engine Deployer
# App Engine Service Admin
# Cloud Build Editor
# Service Account User
# Storage Object Admin

cd firegame/server
export GOOGLE_APPLICATION_CREDENTIALS="gac.json"
echo "$1" > "$GOOGLE_APPLICATION_CREDENTIALS"
gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS"
gcloud --project aworldofstruggle app deploy --version v1
