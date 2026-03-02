# Configuration Parameters

## Frontend environment files

| Priority | Source |
|---|---|
| 1 | `.env.prod` (if present) |
| 2 | `.env.local` (if `.env.prod` is missing) |
| 3 | Process env vars (override `.env*`) |

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

| Field | File | Purpose |
|---|---|---|
| `userPoolId` | `src/cognitoConfig.js` | User Pool identifier |
| `userPoolClientId` | `src/cognitoConfig.js` | App client for Hosted UI |
| `domain` | `src/cognitoConfig.js` | Cognito Hosted UI domain |
| `redirectSignIn` | `src/cognitoConfig.js` | Callback target (e.g. `/app/callback`) |
| `redirectSignOut` | `src/cognitoConfig.js` | Post-logout target (current: `/app/login`) |

## Login / Session Behavior

| Behavior | Current implementation |
|---|---|
| Sign-in | Cognito Hosted UI via `signInWithRedirect` |
| Token use | Fresh session token resolved before backend calls |
| Silent refresh | Automatic while refresh token is valid |
| Expired/invalid session | On backend `401`: sign-out + redirect to `/login?reason=expired` |
| User feedback | Login page shows localized "session expired" warning |

For production, ensure Cognito callback/sign-out URLs exactly match deployed URLs (scheme, host, path, slash handling).

## Amplify Hosting vs aws-amplify SDK

| Item | Status |
|---|---|
| Amplify Hosting | Optional, can be removed |
| `aws-amplify` npm package | Required for Cognito auth/session in SPA |

## GitHub Actions deployment variables

| Type | Name |
|---|---|
| Variable | `V_AWS_REGION` |
| Variable | `V_S3_BUCKET_NAME` |
| Variable | `V_CF_DISTRIBUTION_ID` |
| Variable | `V_SITE_URL` |
| Secret | `AWS_CF_DEPL_KEY` |
| Secret | `AWS_CF_DEPL_SEC` |
