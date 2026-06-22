import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ListUserStickersParams } from '@/data/repositories/user-albums.repository';
import { userAlbumsRepository } from '@/data/repositories/user-albums.repository';

export const userAlbumKeys = {
  all: ['user-albums'] as const,
  stickers: (userAlbumId: string, params: ListUserStickersParams) =>
    ['user-albums', userAlbumId, 'stickers', params] as const,
};

export function useUserAlbums() {
  return useQuery({
    queryKey: userAlbumKeys.all,
    queryFn: userAlbumsRepository.findAll,
  });
}

export function useUserAlbumStickers(userAlbumId: string, params: ListUserStickersParams = {}) {
  return useQuery({
    queryKey: userAlbumKeys.stickers(userAlbumId, params),
    queryFn: () => userAlbumsRepository.findStickers(userAlbumId, params),
    enabled: !!userAlbumId,
  });
}

export function useAddUserAlbum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (albumId: string) => userAlbumsRepository.create(albumId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userAlbumKeys.all }),
  });
}

export function useAddUserSticker(userAlbumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ stickerId, quantity }: { stickerId: string; quantity?: number }) =>
      userAlbumsRepository.addSticker(userAlbumId, stickerId, quantity),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['user-albums', userAlbumId, 'stickers'] }),
  });
}
