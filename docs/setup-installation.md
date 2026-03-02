# Setup & Installation

## Prerequisites

- Node.js 20+
- npm 10+
- AWS CLI v2 (for S3/CloudFront deployment)
- WSL/Ubuntu shell recommended for deployment scripts

## Install dependencies

```bash
npm install
```

## Backend prerequisites

1. Create Cognito User Pool + App Client (Hosted UI).
2. Deploy backend Lambda functions and enable Function URLs.
3. Configure CORS for frontend origin.

## Configure local environment

1. Create `.env.local` in repo root.
2. Add all required `VITE_*` backend URL variables (see [configuration-parameters.md](configuration-parameters.md)).
3. Update Cognito settings in `src/cognitoConfig.js`.

## Run locally

```bash
npm run dev
```

## Optional: create deploy IAM identity/policy

```bash
export BUCKET="<bucket-name>"
export CF_DISTRIBUTION_ID="<distribution-id>"
export PREFIX="app"

./deployment/crt-aws-account.sh
```

Script output includes:
- IAM user `FRENCH_APP_DEPL`
- Managed policy `FrenchAppWebAppDeployPolicy`
- Access key pair for GitHub secrets
