import { api } from '@/shared/lib/axios';

import type { User } from '@/features/users/shared/types/user.types';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: User & {
    name: string;
  };
  mustChangeCredentials: boolean;
}

export interface AuthMeResponse {
  user: (User & {
    name?: string;
  }) | null;
  mustChangeCredentials?: boolean;
}

export interface ChangeCredentialsPayload {
  username: string;
  password: string;
}

export interface ChangeCredentialsResponse {
  success: boolean;
  mustChangeCredentials: false;
  userId: number;
}

export async function login(
  data: LoginPayload,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    '/auth/login',
    data,
  );

  return response.data;
}

export async function getMe(): Promise<AuthMeResponse> {
  const response = await api.get<AuthMeResponse>('/auth/me');

  return response.data;
}

export async function changeCredentials(
  data: ChangeCredentialsPayload,
): Promise<ChangeCredentialsResponse> {
  const response = await api.post<ChangeCredentialsResponse>(
    '/auth/change-credentials',
    data,
  );

  return response.data;
}

export async function logout() {
  const response = await api.post('/auth/logout');

  return response.data;
}