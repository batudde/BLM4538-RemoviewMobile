import { API_BASE_URL } from '../config/api';

type RequestOptions = RequestInit & {
  token?: string | null;
};

export async function request<T>(path: string, options: RequestOptions = {}) {
  const { token, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
  });

  const text = await response.text();
  const data = parseResponse(text);

  if (!response.ok) {
    const message =
      typeof data === 'string'
        ? data
        : (data as { message?: string; Message?: string })?.message ??
          (data as { message?: string; Message?: string })?.Message ??
          `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}

function parseResponse(text: string) {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
