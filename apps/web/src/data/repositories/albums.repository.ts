import { BaseRepository } from './base.repository';

export type Album = { id: string; name: string; createdAt: string };
export type Sticker = { id: string; albumId: string; code: string; section: string };

class AlbumsRepository extends BaseRepository {
  findAll() {
    return this.http.get<Album[]>('/albums').then((r) => r.data);
  }

  findStickers(albumId: string, section?: string) {
    const params = section ? { section } : {};
    return this.http.get<Sticker[]>(`/albums/${albumId}/stickers`, { params }).then((r) => r.data);
  }

  create(formData: FormData) {
    return this.http
      .post<Album>('/albums', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  }
}

export const albumsRepository = new AlbumsRepository();
