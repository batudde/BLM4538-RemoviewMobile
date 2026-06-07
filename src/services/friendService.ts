import { getSession } from '../storage/authStorage';
import { Film } from '../types/film';
import { request } from './http';

export type FriendshipStatus = 'none' | 'pending_sent' | 'pending_received' | 'friends';

export type FriendUser = {
  id: number;
  username: string;
  profileDescription: string | null;
  favoriteCount: number;
  friendCount: number;
  favoriteFilms: Film[];
};

export type FriendSearchResult = FriendUser & {
  friendshipStatus: FriendshipStatus;
};

export type FriendRequest = {
  id: number;
  user: FriendUser;
  createdAtUtc: string;
};

async function getToken() {
  const { token } = await getSession();

  if (!token) {
    throw new Error('Oturum bulunamadi. Lutfen tekrar giris yap.');
  }

  return token;
}

export async function getFriends() {
  return request<FriendUser[]>('/api/friends', {
    token: await getToken(),
  });
}

export async function searchUsers(username: string) {
  return request<FriendSearchResult[]>(`/api/friends/search?username=${encodeURIComponent(username)}`, {
    token: await getToken(),
  });
}

export async function sendFriendRequest(username: string) {
  return request<null>(`/api/friends/request/${encodeURIComponent(username)}`, {
    method: 'POST',
    token: await getToken(),
  });
}

export async function getFriendRequests() {
  return request<FriendRequest[]>('/api/friends/requests', {
    token: await getToken(),
  });
}

export async function acceptFriendRequest(requestId: number) {
  return request<null>(`/api/friends/requests/${requestId}/accept`, {
    method: 'POST',
    token: await getToken(),
  });
}

export async function rejectFriendRequest(requestId: number) {
  return request<null>(`/api/friends/requests/${requestId}/reject`, {
    method: 'POST',
    token: await getToken(),
  });
}

export async function getPublicProfile(username: string) {
  return request<FriendUser>(`/api/friends/profile/${encodeURIComponent(username)}`, {
    token: await getToken(),
  });
}
