# Setup & Installation

## Prerequisites

| Tool | Version / Note |
|---|---|
| Node.js | 20+ |
| npm | 10+ |
| AWS CLI | v2 (for deployment) |
| Shell | WSL/Ubuntu recommended |

## Setup Flow

| Step | Action |
|---|---|
| 1 | Install dependencies: `npm install` |
| 2 | Create Cognito User Pool + App Client (Hosted UI) |
| 3 | Deploy backend Lambda functions with Function URLs + CORS |
| 4 | Create `.env.local` and set required `VITE_*` variables |
| 5 | Update Cognito config in `src/cognitoConfig.js` |
| 6 | Start app: `npm run dev` |

## Optional: Create Deploy IAM Identity/Policy

```bash
export BUCKET="<bucket-name>"
export CF_DISTRIBUTION_ID="<distribution-id>"
export PREFIX="app"

./deployment/crt-aws-account.sh
```

| Output | Value |
|---|---|
| IAM user | `FRENCH_APP_DEPL` |
| Managed policy | `FrenchAppWebAppDeployPolicy` |
| Credentials output | `AWS_CF_DEPL_KEY`, `AWS_CF_DEPL_SEC` |
