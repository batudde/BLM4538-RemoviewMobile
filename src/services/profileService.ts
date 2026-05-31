import { request } from './http';
import { getSession } from '../storage/authStorage';

export type UserProfile = {
  email: string;
  username: string;
  profileDescription: string | null;
};

export async function getProfile() {
  const { token } = await getSession();

  if (!token) {
    throw new Error('Oturum bulunamadi. Lutfen tekrar giris yap.');
  }

  return request<UserProfile>('/api/profile', {
    token,
  });
}

export async function updateProfile(input: { profileDescription: string }) {
  const { token } = await getSession();

  if (!token) {
    throw new Error('Oturum bulunamadi. Lutfen tekrar giris yap.');
  }

  return request<UserProfile>('/api/profile', {
    method: 'PUT',
    token,
    body: JSON.stringify(input),
  });
}
