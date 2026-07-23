let currentToken: string | null = null;
let onRefreshFailed: (() => void) | null = null;

export function setApiToken(token: string | null) {
  currentToken = token;
}

export function setOnRefreshFailed(cb: () => void) {
  onRefreshFailed = cb;
}

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (currentToken) headers['Authorization'] = `Bearer ${currentToken}`;

  const res = await fetch(`/api/v1${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (res.status === 401 && currentToken) {
    const refreshRes = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (refreshRes.ok) {
      const { accessToken } = await refreshRes.json();
      currentToken = accessToken;
      sessionStorage.setItem('access_token', accessToken);

      headers['Authorization'] = `Bearer ${accessToken}`;
      const retryRes = await fetch(`/api/v1${path}`, {
        ...options,
        headers,
        credentials: 'include',
      });
      if (!retryRes.ok) throw new Error(await retryRes.text());
      return retryRes.json();
    }

    currentToken = null;
    sessionStorage.removeItem('access_token');
    onRefreshFailed?.();
    throw new Error('Session expired');
  }

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiGet(path: string) {
  return request(path, { method: 'GET' });
}

export async function apiPost(path: string, body?: unknown) {
  return request(path, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPatch(path: string, body: unknown) {
  return request(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function apiDelete(path: string) {
  return request(path, { method: 'DELETE' });
}
