import { fetchAuthSession, signOut } from 'aws-amplify/auth';

export const SESSION_EXPIRED_STORAGE_KEY = 'auth_session_expired';

export async function authenticatedFetch(url, options = {}, fallbackToken = null) {
  const resolvedToken = await resolveIdToken(fallbackToken);
  const headers = new Headers(options.headers || {});

  if (resolvedToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${resolvedToken}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    handleUnauthorized();
  }

  return response;
}

async function resolveIdToken(fallbackToken = null) {
  try {
    const session = await fetchAuthSession();
    return session?.tokens?.idToken?.toString() || fallbackToken;
  } catch {
    return fallbackToken;
  }
}

function handleUnauthorized() {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.setItem(SESSION_EXPIRED_STORAGE_KEY, '1');

  signOut().catch(() => {});

  const basePath = normalizeBasePath(import.meta.env.BASE_URL || '/');
  const loginUrl = `${basePath}login?reason=expired`;

  if (`${window.location.pathname}${window.location.search}` !== loginUrl) {
    window.location.assign(loginUrl);
  }
}

function normalizeBasePath(value) {
  if (!value || value === '/') {
    return '/';
  }

  if (value.startsWith('/') && value.endsWith('/')) {
    return value;
  }

  return `/${value.replace(/^\/+|\/+$/g, '')}/`;
}
