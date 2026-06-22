import { BaseRepository } from './base.repository';

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; email: string; password: string };
export type AuthTokens = { accessToken: string; refreshToken: string };

class AuthRepository extends BaseRepository {
  login(payload: LoginPayload) {
    return this.http.post<AuthTokens>('/auth/login', payload).then((r) => r.data);
  }

  register(payload: RegisterPayload) {
    return this.http.post<AuthTokens>('/auth/register', payload).then((r) => r.data);
  }

  logout() {
    return this.http.post<void>('/auth/logout').then((r) => r.data);
  }
}

export const authRepository = new AuthRepository();
