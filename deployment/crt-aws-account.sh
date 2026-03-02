#!/usr/bin/env bash

set -euo pipefail

# Creates/updates IAM user FRENCH_APP_DEPL and a reusable customer-managed policy
# for deployment and additional S3/CloudFront operations for one app
# (one bucket + one distribution).
#
# Usage:
#   export BUCKET="landing-page-sn-itx"
#   export CF_DISTRIBUTION_ID="ENXT5WKR62Q6J"
#   export PREFIX="app"
#   ./deployment/crt-aws-account.sh
#
# Or:
#   ./deployment/crt-aws-account.sh <s3-bucket-name> <cloudfront-distribution-id> [prefix]
#
# Example:
#   ./deployment/crt-aws-account.sh my-spa-bucket E1234567890ABC app

USER_NAME="FRENCH_APP_DEPL"
POLICY_NAME="FrenchAppWebAppDeployPolicy"

if [[ $# -gt 3 ]]; then
  echo "Usage: $0 [<s3-bucket-name> <cloudfront-distribution-id> [prefix]]"
  exit 1
fi

BUCKET_NAME="${1:-${BUCKET:-}}"
CF_DISTRIBUTION_ID="${2:-${CF_DISTRIBUTION_ID:-}}"
PREFIX="${3:-${PREFIX:-app}}"

if [[ -z "${BUCKET_NAME}" || -z "${CF_DISTRIBUTION_ID}" ]]; then
  echo "Missing required values."
  echo "Set env vars BUCKET and CF_DISTRIBUTION_ID, or pass args:"
  echo "  $0 <s3-bucket-name> <cloudfront-distribution-id> [prefix]"
  exit 1
fi

PREFIX="${PREFIX#/}"
PREFIX="${PREFIX%/}"

if [[ -z "${PREFIX}" ]]; then
  echo "Prefix cannot be empty."
  exit 1
fi

echo "Resolving AWS account ID..."
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
POLICY_ARN="arn:aws:iam::${ACCOUNT_ID}:policy/${POLICY_NAME}"

TMP_POLICY_FILE="$(mktemp)"
cleanup() {
  rm -f "${TMP_POLICY_FILE}"
}
trap cleanup EXIT

cat > "${TMP_POLICY_FILE}" <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3BucketLevelAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetBucketLocation",
        "s3:GetBucketVersioning",
        "s3:ListBucket",
        "s3:ListBucketMultipartUploads"
      ],
      "Resource": "arn:aws:s3:::${BUCKET_NAME}"
    },
    {
      "Sid": "S3ObjectLevelAccess",
      "Effect": "Allow",
      "Action": [
        "s3:AbortMultipartUpload",
        "s3:GetObject",
        "s3:GetObjectTagging",
        "s3:ListMultipartUploadParts",
        "s3:DeleteObject",
        "s3:PutObject",
        "s3:PutObjectTagging"
      ],
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
    },
    {
      "Sid": "CloudFrontDistributionAccess",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetDistribution",
        "cloudfront:GetDistributionConfig",
        "cloudfront:GetInvalidation",
        "cloudfront:ListInvalidations",
        "cloudfront:UpdateDistribution"
      ],
      "Resource": "arn:aws:cloudfront::${ACCOUNT_ID}:distribution/${CF_DISTRIBUTION_ID}"
    }
  ]
}
EOF

echo "Ensuring IAM user ${USER_NAME} exists..."
if ! aws iam get-user --user-name "${USER_NAME}" >/dev/null 2>&1; then
  aws iam create-user --user-name "${USER_NAME}" >/dev/null
  echo "Created user ${USER_NAME}."
else
  echo "User ${USER_NAME} already exists."
fi

echo "Ensuring customer-managed policy ${POLICY_NAME} exists and is up to date..."
if aws iam get-policy --policy-arn "${POLICY_ARN}" >/dev/null 2>&1; then
  VERSION_COUNT="$(aws iam list-policy-versions --policy-arn "${POLICY_ARN}" --query 'length(Versions)' --output text)"
  if [[ "${VERSION_COUNT}" -ge 5 ]]; then
    OLDEST_NON_DEFAULT_VERSION="$(aws iam list-policy-versions \
      --policy-arn "${POLICY_ARN}" \
      --query 'Versions[?IsDefaultVersion==`false`]|sort_by(@,&CreateDate)|[0].VersionId' \
      --output text)"
    if [[ -n "${OLDEST_NON_DEFAULT_VERSION}" && "${OLDEST_NON_DEFAULT_VERSION}" != "None" ]]; then
      aws iam delete-policy-version \
        --policy-arn "${POLICY_ARN}" \
        --version-id "${OLDEST_NON_DEFAULT_VERSION}" >/dev/null
    fi
  fi

  aws iam create-policy-version \
    --policy-arn "${POLICY_ARN}" \
    --policy-document "file://${TMP_POLICY_FILE}" \
    --set-as-default >/dev/null
  echo "Updated managed policy ${POLICY_NAME}."
else
  aws iam create-policy \
    --policy-name "${POLICY_NAME}" \
    --policy-document "file://${TMP_POLICY_FILE}" >/dev/null
  echo "Created managed policy ${POLICY_NAME}."
fi

echo "Attaching managed policy ${POLICY_NAME} to ${USER_NAME}..."
aws iam attach-user-policy \
  --user-name "${USER_NAME}" \
  --policy-arn "${POLICY_ARN}" >/dev/null

echo "Creating a new access key for ${USER_NAME}..."
echo "NOTE: IAM allows max 2 active keys per user. Delete old keys if this fails."
read -r ACCESS_KEY_ID SECRET_ACCESS_KEY <<< "$(aws iam create-access-key \
  --user-name "${USER_NAME}" \
  --query 'AccessKey.[AccessKeyId,SecretAccessKey]' \
  --output text)"

echo
echo "Done. Use these values in GitHub environment secrets:"
echo "  AWS_CF_DEPL_KEY=${ACCESS_KEY_ID}"
echo "  AWS_CF_DEPL_SEC=${SECRET_ACCESS_KEY}"
echo "Managed policy ARN (attach to other identities as needed):"
echo "  ${POLICY_ARN}"
echo
echo "Recommended quick verification:"
echo "  aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::${ACCOUNT_ID}:user/${USER_NAME} --action-names s3:ListBucket s3:GetObject s3:PutObject s3:DeleteObject cloudfront:CreateInvalidation cloudfront:GetDistribution cloudfront:UpdateDistribution"
