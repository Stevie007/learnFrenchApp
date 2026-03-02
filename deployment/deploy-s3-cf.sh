#!/usr/bin/env bash

set -euo pipefail

# Deploy the built SPA to S3 + CloudFront for /app/ hosting.
#
# Required env vars:
#   BUCKET                S3 bucket name
#   CF_DISTRIBUTION_ID    CloudFront distribution ID
#
# Optional env vars:
#   PREFIX                S3 prefix (default: app)
#   DIST                  Build output directory (default: ./dist)

BUCKET="${BUCKET:-}"
CF_DISTRIBUTION_ID="${CF_DISTRIBUTION_ID:-}"
PREFIX="${PREFIX:-app}"
DIST="${DIST:-$(pwd)/dist}"

if [[ -z "${BUCKET}" || -z "${CF_DISTRIBUTION_ID}" ]]; then
  echo "Missing required variables."
  echo "Set: BUCKET and CF_DISTRIBUTION_ID"
  echo "Optional: PREFIX (default: app), DIST (default: ./dist)"
  exit 1
fi

PREFIX="${PREFIX#/}"
PREFIX="${PREFIX%/}"

if [[ ! -d "${DIST}" ]]; then
  echo "Build directory not found: ${DIST}"
  echo "Run: npm run build -- --base=/${PREFIX}/"
  exit 1
fi

echo "Deploying ${DIST} to s3://${BUCKET}/${PREFIX}/ ..."

aws s3 sync "${DIST}/assets/" "s3://${BUCKET}/${PREFIX}/assets/" \
  --delete \
  --cache-control "public,max-age=31536000,immutable"

aws s3 sync "${DIST}/" "s3://${BUCKET}/${PREFIX}/" \
  --delete \
  --exclude "assets/*" \
  --cache-control "no-cache,no-store,must-revalidate"

aws s3 cp "${DIST}/index.html" "s3://${BUCKET}/${PREFIX}/index.html" \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html; charset=utf-8"

aws cloudfront create-invalidation \
  --distribution-id "${CF_DISTRIBUTION_ID}" \
  --paths "/${PREFIX}/*"

echo "Deployment finished."
