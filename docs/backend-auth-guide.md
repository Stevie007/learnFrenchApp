# Backend Authentication Implementation Guide

## Overview
The frontend sends JWT ID tokens in the `Authorization` header for API calls. Backend Lambda endpoints must validate these tokens.

## Cognito Inputs (Example)

| Field | Value |
|---|---|
| User Pool ID | `eu-north-1_9OeaeOvBB` |
| Region | `eu-north-1` |
| App Client ID | `2q93kgkc5g7aiarpf8pbogb7sb` |

## Endpoints Requiring JWT Validation

| Frontend variable |
|---|
| `VITE_BACKEND_GET_TEXT_FROM_URL` |
| `VITE_BACKEND_TRANSLATE_VOCAB` |
| `VITE_BACKEND_GET_AUDIO_FOR_TEXT` |
| `VITE_BACKEND_VOCABULARY_API` |

## Validation options

### Option A: validate JWT in each Lambda
Validate at minimum:
- signature (JWKS)
- expiration (`exp`)
- issuer (`iss`)
- audience/client when required

### Option B: API Gateway authorizer (recommended for production)
Use one Lambda authorizer attached to API routes and cache validation results.

AWS reference:
- https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html

## Testing

| Step | Action |
|---|---|
| 1 | Capture a valid ID token from frontend session |
| 2 | Call endpoint with `Authorization: Bearer <token>` |
| 3 | Verify backend returns `401` for missing/invalid token |

Example:

```bash
curl -X POST https://your-lambda-url.amazonaws.com/endpoint \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: text/plain" \
  -d "test data"
```

## Security notes

| Rule | Why |
|---|---|
| Use `sub` as user ID | Email can change |
| Ignore client-sent user IDs | Prevent spoofing |
| Enforce HTTPS | Protect token transport |
| Allow `Authorization` in CORS | Required for bearer token calls |

## Migration suggestion

| Phase | Action |
|---|---|
| 1 | Add JWT validation in permissive mode |
| 2 | Deploy frontend token forwarding |
| 3 | Test all endpoints |
| 4 | Enforce mandatory valid token |
| 5 | Remove temporary/basic auth |
