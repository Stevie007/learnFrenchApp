# Configuration Parameters

## Frontend environment files

Load order:
1. `.env.prod` (if present)
2. `.env.local` (if `.env.prod` is missing)
3. Process env vars (override `.env*` values)

## Required variables

| Variable | Purpose | Required |
|---|---|---|
| `VITE_BACKEND_GET_TEXT_FROM_URL` | Lambda URL: fetch article text from URL | Yes |
| `VITE_BACKEND_TRANSLATE_VOCAB` | Lambda URL: translation | Yes |
| `VITE_BACKEND_GET_AUDIO_FOR_TEXT` | Lambda URL: text-to-speech | Yes |
| `VITE_BACKEND_VOCABULARY_API` | Lambda URL: vocabulary CRUD API | Yes |

## Optional variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_MAX_TEXT_LENGTH` | Max chars for translation | `4000` |
| `VITE_MAX_TEXT_TO_AUDIO_LENGTH` | Max chars for audio generation | `4000` |
| `VITE_DEBUG_LEVEL` | Debug mode | `false` |

## Cognito settings

Update these fields in `src/cognitoConfig.js`:
- `userPoolId`
- `userPoolClientId`
- `domain`
- `redirectSignIn`
- `redirectSignOut`

For production, ensure callback/signout URLs match your deployed domain paths (for SPA under `/app/`).

## GitHub Actions deployment variables

Set in environment `PROD` (or your target env):

- `V_AWS_REGION`
- `V_S3_BUCKET_NAME`
- `V_CF_DISTRIBUTION_ID`
- `V_SITE_URL`

GitHub secrets used by workflow:
- `AWS_CF_DEPL_KEY`
- `AWS_CF_DEPL_SEC`
