#!/usr/bin/env bash
set -euo pipefail

SERVER="ubuntu@145.239.71.158"
REMOTE_DIR="/var/www/devcareer.am/frontend/landing"

echo "==> Installing dependencies..."
npm ci

echo "==> Building project..."
npm run build

echo "==> Deploying to $SERVER:$REMOTE_DIR ..."
rsync -avz --delete --rsync-path="sudo rsync" dist/ "$SERVER:$REMOTE_DIR/"

echo "==> Done! Deployed successfully."
