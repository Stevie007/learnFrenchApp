# Build and Deploy

## Quick start (local)

```bash
npm install
npm run dev
```

## Build for `/app/`

```bash
npm run build -- --base=/app/
```

## Deploy manually to S3 + CloudFront

From WSL/Ubuntu shell:

```bash
export BUCKET="<bucket-name>"
export CF_DISTRIBUTION_ID="<distribution-id>"
export PREFIX="app"
export DIST="/mnt/c/025_DEV/Repos-2025-11/learnFrench/learnFrenchWebApp/dist"

./deployment/deploy-s3-cf.sh
```

## Deploy via GitHub Actions

Workflow file: `.github/workflows/deploy-s3-cf.yml`

### Triggers
- `workflow_dispatch`
- Push to `main`

### Required GitHub environment variables
- `V_AWS_REGION`
- `V_S3_BUCKET_NAME`
- `V_CF_DISTRIBUTION_ID`
- `V_SITE_URL`

### Required GitHub secrets
- `AWS_CF_DEPL_KEY`
- `AWS_CF_DEPL_SEC`

## Verification checklist

- `https://<your-domain>/app/` loads app shell
- `https://<your-domain>/app/login` works on direct refresh
- `https://<your-domain>/app/assets/<file>.js` returns HTTP 200
- Cognito login redirects and callback work
