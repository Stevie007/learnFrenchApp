import { Amplify } from 'aws-amplify';

const cognitoConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'eu-north-1_9OeaeOvBB',
      userPoolClientId: '2q93kgkc5g7aiarpf8pbogb7sb',
      loginWith: {
        oauth: {
          domain: 'eu-north-19oeaeovbb.auth.eu-north-1.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: ['http://localhost:5174/callback'],
          redirectSignOut: ['http://localhost:5174'],
          responseType: 'code',
        }
      }
    }
  }
};

Amplify.configure(cognitoConfig);

export default cognitoConfig;
