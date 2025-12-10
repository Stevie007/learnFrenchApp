# Backend Authentication Implementation Guide

## Overview
The frontend now sends JWT ID tokens in the Authorization header for all API calls. Your Lambda functions need to validate these tokens.

## Cognito Configuration
- **User Pool ID**: `eu-north-1_9OeaeOvBB`
- **Region**: `eu-north-1`
- **App Client ID**: `2q93kgkc5g7aiarpf8pbogb7sb`

## Lambda Functions to Update

### 1. **Get Text from URL** (`VITE_BACKEND_GET_TEXT_FROM_URL`)
- Receives: `Authorization: Bearer <idToken>` header
- Content-Type: `text/plain`

### 2. **Translate Vocabulary** (`VITE_BACKEND_TRANSLATE_VOCAB`)
- Receives: `Authorization: Bearer <idToken>` header
- Content-Type: `text/plain`

### 3. **Get Audio** (`VITE_BACKEND_GET_AUDIO_FOR_TEXT`)
- Receives: `Authorization: Bearer <idToken>` header
- Content-Type: `text/plain`

### 4. **Vocabulary CRUD** (`VITE_BACKEND_VOCABULARY_API`)
- All endpoints (GET, POST, PUT, DELETE)
- Receives: `Authorization: Bearer <idToken>` header
- Content-Type: `application/json`

## Implementation Steps

### Option 1: JWT Validation in Each Lambda (Recommended for learning)

Install JWT library in each Lambda:
```bash
npm install jsonwebtoken jwks-rsa
```

Add validation code to each Lambda:

```python
# Python example
import json
import jwt
from jwt import PyJWKClient

USER_POOL_ID = 'eu-north-1_9OeaeOvBB'
REGION = 'eu-north-1'
JWKS_URL = f'https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json'

def verify_token(token):
    """Verify JWT token from Cognito"""
    try:
        # Get public keys from Cognito
        jwks_client = PyJWKClient(JWKS_URL)
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        
        # Verify token
        decoded = jwt.decode(
            token,
            signing_key.key,
            algorithms=['RS256'],
            options={"verify_exp": True}
        )
        
        return decoded  # Contains user info: email, sub, etc.
    except Exception as e:
        print(f'Token verification failed: {e}')
        return None

def lambda_handler(event, context):
    # Extract token from header
    auth_header = event.get('headers', {}).get('Authorization', '')
    
    if not auth_header.startswith('Bearer '):
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Missing or invalid Authorization header'})
        }
    
    token = auth_header.replace('Bearer ', '')
    
    # Verify token
    user_info = verify_token(token)
    if not user_info:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Invalid token'})
        }
    
    # Extract user identity
    user_email = user_info.get('email')
    user_sub = user_info.get('sub')  # Unique user ID
    
    # Your Lambda logic here
    # Use user_email or user_sub for authorization
    
    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Success'})
    }
```

```javascript
// Node.js example
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const USER_POOL_ID = 'eu-north-1_9OeaeOvBB';
const REGION = 'eu-north-1';
const JWKS_URI = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;

const client = jwksClient({
  jwksUri: JWKS_URI
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
    } else {
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    }
  });
}

async function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

exports.handler = async (event) => {
  // Extract token
  const authHeader = event.headers?.Authorization || event.headers?.authorization || '';
  
  if (!authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Missing or invalid Authorization header' })
    };
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  try {
    // Verify token
    const userInfo = await verifyToken(token);
    
    // Extract user identity
    const userEmail = userInfo.email;
    const userSub = userInfo.sub;
    
    // Your Lambda logic here
    // Use userEmail or userSub for authorization
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success', user: userEmail })
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid token' })
    };
  }
};
```

### Option 2: API Gateway Lambda Authorizer (Production-ready)

Create a single Lambda Authorizer that validates tokens for all endpoints:

1. **Create Authorizer Lambda**:
   - Validates JWT token
   - Returns IAM policy allowing/denying access
   - Caches results for performance

2. **Attach to API Gateway**:
   - Configure as REQUEST authorizer
   - Cache for 300 seconds
   - Automatically validates all requests

Reference: [AWS Lambda Authorizer Documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html)

## Testing

### 1. Get JWT Token from Frontend
- Enable "Entwickler-Erweiterungen" in the app
- Copy the JWT ID Token from the debug field

### 2. Test Lambda with Token
```bash
curl -X POST https://your-lambda-url.amazonaws.com/endpoint \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: text/plain" \
  -d "test data"
```

### 3. Verify Token Claims
Decode JWT at https://jwt.io to see:
- `sub`: User's unique ID (UUID)
- `email`: User's email address
- `exp`: Expiration timestamp
- `iss`: Issuer (Cognito User Pool URL)

## Security Notes

1. **Always verify the token signature** using Cognito's public keys
2. **Check expiration** (`exp` claim)
3. **Validate issuer** matches your User Pool
4. **Use `sub` (not email)** as the primary user identifier (emails can change)
5. **Don't trust client-sent user IDs** - always use the one from the verified token
6. **Enable HTTPS only** for all Lambda Function URLs
7. **Set CORS properly** to allow your frontend domain

## Migration Strategy

1. **Phase 1**: Add token validation to Lambda functions (still accept requests without tokens)
2. **Phase 2**: Deploy frontend with token-sending code
3. **Phase 3**: Test thoroughly with tokens
4. **Phase 4**: Make tokens required (reject requests without valid tokens)
5. **Phase 5**: Remove Amplify Basic Auth

## Cost Impact

- JWT validation adds ~50-100ms latency per cold start
- Minimal ongoing cost (just CPU time for verification)
- Lambda Authorizer caching reduces overhead significantly

## Troubleshooting

### Common Issues

**401 Unauthorized**:
- Check token is being sent in header
- Verify token hasn't expired (1 hour default)
- Ensure JWKS URL is correct
- Check Lambda has internet access to fetch Cognito public keys

**CORS Errors**:
- Add `Access-Control-Allow-Headers: Authorization` to Lambda response headers
- Ensure OPTIONS method handles preflight requests

**Token Expired**:
- Frontend automatically refreshes tokens (handled by Amplify)
- Tokens expire after 1 hour by default (configurable in Cognito)

## Next Steps

1. Update Lambda functions with token validation
2. Test each endpoint with valid JWT token
3. Verify user-specific data isolation (users can only access their own data)
4. Monitor CloudWatch logs for authentication errors
5. Consider implementing rate limiting per user
