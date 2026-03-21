import { request } from './http';
import { isLikelyJwt } from '../utils/jwt';

type AuthPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  token?: string;
  Token?: string;
  accessToken?: string;
  jwt?: string;
};

export async function registerUser(payload: AuthPayload) {
  return request<{ message?: string; Message?: string }>('/api/Auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: AuthPayload) {
  const response = await request<LoginResponse | string>('/api/Auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const token =
    typeof response === 'string'
      ? response.replaceAll('"', '')
      : response.Token ?? response.token ?? response.accessToken ?? response.jwt ?? '';

  if (!token || !isLikelyJwt(token)) {
    throw new Error('Sunucudan gecerli bir JWT token alinamadi.');
  }

  return token;
}
