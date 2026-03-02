# Build and Deploy

## Quick Start (Local)

```bash
npm install
npm run dev
```

## Build

```bash
npm run build -- --base=/app/
```

## Manual Deploy (S3 + CloudFront)

From WSL/Ubuntu:

```bash
export BUCKET="<bucket-name>"
export CF_DISTRIBUTION_ID="<distribution-id>"
export PREFIX="app"
export DIST="/mnt/c/025_DEV/Repos-2025-11/learnFrench/learnFrenchWebApp/dist"

./deployment/deploy-s3-cf.sh
```

## GitHub Actions Deploy

Workflow file: `.github/workflows/deploy-s3-cf.yml`

| Item | Value |
|---|---|
| Trigger | `workflow_dispatch` (manual only) |
| Region variable | `V_AWS_REGION` |
| Bucket variable | `V_S3_BUCKET_NAME` |
| Distribution variable | `V_CF_DISTRIBUTION_ID` |
| Site URL variable | `V_SITE_URL` |
| Access key secret | `AWS_CF_DEPL_KEY` |
| Secret key secret | `AWS_CF_DEPL_SEC` |

## Verification

| Check | Expected |
|---|---|
| `https://<your-domain>/app/` | App shell loads |
| `https://<your-domain>/app/login` | Route works on direct refresh |
| `https://<your-domain>/app/assets/<file>.js` | HTTP 200 |
| Cognito flow | Login + callback + logout redirect work |
