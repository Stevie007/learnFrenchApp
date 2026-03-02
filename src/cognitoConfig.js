/**
 * AWS Cognito Configuration
 * Note: User Pool ID and Client ID are safe to expose in public code
 * They are designed to be used in client-side applications.
 * For your project, adapt the configuration to your needs.
 * 
 */
import { Amplify } from 'aws-amplify';

const basePath = normalizeBasePath(import.meta.env.BASE_URL || '/');
const runtimeOrigin = typeof window !== 'undefined' ? window.location.origin : null;
const runtimeRedirectSignIn = runtimeOrigin ? `${runtimeOrigin}${basePath}callback` : null;
const runtimeRedirectSignOut = runtimeOrigin ? `${runtimeOrigin}${basePath}login` : null;

const redirectSignIn = uniqueUrls([
  runtimeRedirectSignIn,
  'http://localhost:5173/callback',
  'http://localhost:5174/callback',
]);

const redirectSignOut = uniqueUrls([
  runtimeRedirectSignOut,
  'http://localhost:5173/login',
  'http://localhost:5174/login',
]);

const cognitoConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'eu-north-1_9OeaeOvBB',
      userPoolClientId: '2q93kgkc5g7aiarpf8pbogb7sb',
      loginWith: {
        oauth: {
          domain: 'eu-north-19oeaeovbb.auth.eu-north-1.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn,
          redirectSignOut,
          responseType: 'code',
        }
      }
    }
  }
};

Amplify.configure(cognitoConfig);

export default cognitoConfig;

function normalizeBasePath(value) {
  if (!value || value === '/') {
    return '/';
  }

  if (value.startsWith('/') && value.endsWith('/')) {
    return value;
  }

  return `/${value.replace(/^\/+|\/+$/g, '')}/`;
}

function uniqueUrls(values) {
  return [...new Set(values.filter(Boolean))];
}
