# On Parle Français - Frontend (React + Vite)

**⚠️ Experimental training code. Use at your own risk.**

This repository contains the frontend SPA only. The backend (Lambda services) is maintained separately.

## One-view overview

| Area | What it covers | Link |
|---|---|---|
| Docs Index | Single place with links to all docs pages | [docs/README.md](docs/README.md) |
| Setup & Installation | Prerequisites, local start, optional IAM bootstrap | [docs/setup-installation.md](docs/setup-installation.md) |
| Configuration Parameters | `.env` variables, Cognito settings, GitHub Action vars/secrets | [docs/configuration-parameters.md](docs/configuration-parameters.md) |
| Build and Deploy | Quick start, manual deploy script, GitHub workflow deploy, verification checklist | [docs/build-deploy.md](docs/build-deploy.md) |
| Backend Auth Guide | JWT expectations and backend validation approach | [docs/backend-auth-guide.md](docs/backend-auth-guide.md) |

## Key project files

- App entry: `src/main.jsx`
- Auth context: `src/AuthContext.jsx`
- Vocabulary module: `src/VocabularyModule.jsx`
- Deployment IAM bootstrap: `deployment/crt-aws-account.sh`
- Deployment script (manual S3/CF): `deployment/deploy-s3-cf.sh`
- GitHub workflow: `.github/workflows/deploy-s3-cf.yml`

## Notes

- SPA is served under `/app/` in S3/CloudFront setup.
- Cognito callback/logout URLs must include `/app/` paths in production.

## License

MIT - see [LICENSE](LICENSE)
