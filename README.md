
# On Parle Français - French Vocabulary Learning App

**⚠️ Disclaimer - This is experimental training code. Use at your own risk. The author is not liable for any bugs, issues, or damages that may result from the use of this code.**

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [License](#license)
- [Configuration Guide](#configuration-guide)
  - [Environment Variables (.env.local)](#environment-variables-envlocal)
  - [AWS Cognito Configuration](#aws-cognito-configuration-srccognitoconfigjs)
  - [AWS Amplify Deployment URLs](#aws-amplify-deployment-urls)
  - [Setup Steps for Fork/Clone](#setup-steps-for-forkclone)
- [Possible Next Steps](#possible-next-steps)
- [Deployment](#deployment)
- [React + Vite](#react--vite---update)

---
## Overview

**This repository contains the frontend SPA (Single Page Application) only.**

The French learning app consists of two separate repositories:
- **Frontend (this repo)**: React SPA with AWS Cognito authentication
- **Backend**: AWS Lambda functions for text processing, translation, and vocabulary management

📋 **For overall architecture and system explanation**, see the backend repository:  
[https://github.com/Stevie007/learnFrenchAppBackend/blob/main/README.md](https://github.com/Stevie007/learnFrenchAppBackend/blob/main/README.md)

### Frontend Features

A web application for learning French vocabulary through text translation and audio generation. Built with React, AWS Cognito authentication, and AWS Lambda backend services.

## Features

- URL or text input for French content translation
- Automated French-to-German translation
- Text-to-speech audio generation
- Vocabulary management with review system
- AWS Cognito authentication (passwordless email login)
- Multi-language support (German/English)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

# Configuration Guide

To run this application with your own AWS infrastructure, you need to configure the following parameters:

## Environment Variables (.env.local)

Create a `.env.local` file in the project root with these variables:

| Variable | Purpose | Example Value | Required |
|----------|---------|---------------|----------|
| `VITE_BACKEND_GET_TEXT_FROM_URL` | Lambda URL for fetching text from URLs | `https://xxx.lambda-url.eu-north-1.on.aws/` | Yes |
| `VITE_BACKEND_TRANSLATE_VOCAB` | Lambda URL for translating vocabulary | `https://yyy.lambda-url.eu-north-1.on.aws/` | Yes |
| `VITE_BACKEND_GET_AUDIO_FOR_TEXT` | Lambda URL for text-to-speech | `https://zzz.lambda-url.eu-north-1.on.aws/` | Yes |
| `VITE_BACKEND_VOCABULARY_API` | Lambda URL for vocabulary CRUD operations | `https://www.lambda-url.eu-north-1.on.aws/` | Yes |
| `VITE_MAX_TEXT_LENGTH` | Maximum characters for translation | `4000` | No (defaults to 4000) |
| `VITE_MAX_TEXT_TO_AUDIO_LENGTH` | Maximum characters for audio generation | `4000` | No (defaults to 4000) |
| `VITE_DEBUG_LEVEL` | Enable debug mode | `true` or `false` | No (defaults to false) |

**Note:** All Lambda URLs must be created in your AWS account. See the backend repository for Lambda function implementation.

## AWS Cognito Configuration (src/cognitoConfig.js)

| Parameter | Location | Purpose | How to Adapt |
|-----------|----------|---------|--------------|
| `userPoolId` | `src/cognitoConfig.js` line 13 | AWS Cognito User Pool ID | Create your own User Pool in AWS Cognito and replace with your pool ID (format: `region_xxxxxxxxx`) |
| `userPoolClientId` | `src/cognitoConfig.js` line 14 | Cognito App Client ID | Create an app client in your User Pool and use that client ID |
| `domain` | `src/cognitoConfig.js` line 17 | Cognito hosted UI domain | Set up a domain in your User Pool's App Integration settings |
| `redirectSignIn` | `src/cognitoConfig.js` lines 19-22 | OAuth callback URLs | Update with your local dev URL and production Amplify/hosting URL |
| `redirectSignOut` | `src/cognitoConfig.js` lines 23-26 | Logout redirect URLs | Update with your local dev URL and production Amplify/hosting URL |

**Security Note:** User Pool ID and Client ID are safe to commit to public repositories. They are designed to be used in client-side applications and visible in browser code.

## AWS Amplify Deployment URLs

If deploying to AWS Amplify, update the production URLs in:
- `cognitoConfig.js` - Add your Amplify app URL to redirect arrays
- Cognito User Pool - Add same URLs to allowed callback/logout URLs in AWS Console

## Setup Steps for Fork/Clone

1. **Create AWS Cognito User Pool**
   - Region: Choose your preferred region
   - Sign-in options: Email
   - No MFA required
   - Create app client with Hosted UI enabled
   - Configure OAuth 2.0 flows: Authorization code grant
   - Scopes: `openid`, `email`, `profile`

2. **Deploy Backend Lambda Functions**
   - See backend repository for Lambda implementations
   - Deploy 4 Lambda functions with Function URLs enabled
   - Enable CORS on Lambda Function URLs
   - Copy Lambda URLs to `.env.local`

3. **Update Configuration Files**
   - Create `.env.local` with your Lambda URLs
   - Edit `src/cognitoConfig.js` with your Cognito details
   - Update callback URLs for your domain

4. **Install & Run**
   ```bash
   npm install
   npm run dev
   ```

5. **Deploy to Production** (Optional)
   - Connect to AWS Amplify
   - Configure build settings (Amplify auto-detects Vite)
   - Disable Basic Auth in Amplify (Cognito handles auth)
   - Add production URL to Cognito allowed redirects

---

# Possible next steps
11.11.25 - major release is done. Maybe I leave it as it is. Possible extensions:
- App / user interface
    - in translation result visible to user add a third row with vocabulary
    - recall / repeat: copy a paragraph or word with "one click" into a "remember" list
    - store entry into db
- security ... long list - start with
    - security for backend service (currently open / no security)
    - login / user concept in aws ... what would be the right way
    - WAF / FW / GW for UI AND also for BE services
- automation
    - UI -> "OK" with Apmlify Github trigger on "push"
    - backend

# Deployment
Take care with CORS - configure in Amplify OR in code.

I had a running config running for some hours (CORS in code, not Amplify), 
and 5 min later I received a CORS error.

So I decided for CORS in Amplify and NOT in code. 
If you run into challenges check both, and check http header parameter, 
exactly ONE cors rule should appear, not zero, and not more than one.


# React + Vite - Update

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Repo-Test - ignore this line ;-)