import { BaseRepository } from './base.repository';

export type UserAlbum = {
  id: string;
  userId: string;
  albumId: string;
  album: { id: string; name: string };
  createdAt: string;
};

export type UserSticker = {
  id: string;
  userAlbumId: string;
  stickerId: string;
  quantity: number;
  sticker: { id: string; code: string; section: string };
  userSticker: { id: string; quantity: number } | null;
};

export type ListUserStickersParams = {
  page?: number;
  limit?: number;
  code?: string;
  filter?: 'missing' | 'repeated';
};

export type PaginatedUserStickers = {
  data: UserSticker[];
  meta: { total: number; page: number; limit: number; pages: number };
};

class UserAlbumsRepository extends BaseRepository {
  findAll() {
    return this.http.get<UserAlbum[]>('/user-albums').then((r) => r.data);
  }

  create(albumId: string) {
    return this.http.post<UserAlbum>('/user-albums', { albumId }).then((r) => r.data);
  }

  findStickers(userAlbumId: string, params: ListUserStickersParams = {}) {
    return this.http
      .get<PaginatedUserStickers>(`/user-albums/${userAlbumId}/stickers`, { params })
      .then((r) => r.data);
  }

  addSticker(userAlbumId: string, stickerId: string, quantity = 1) {
    return this.http
      .post<UserSticker>(`/user-albums/${userAlbumId}/stickers`, { stickerId, quantity })
      .then((r) => r.data);
  }
}

export const userAlbumsRepository = new UserAlbumsRepository();
