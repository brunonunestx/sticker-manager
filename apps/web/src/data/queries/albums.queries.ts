import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Album } from '@/data/repositories/albums.repository';
import { albumsRepository } from '@/data/repositories/albums.repository';

export const albumKeys = {
  all: ['albums'] as const,
  stickers: (albumId: string, section?: string) => ['albums', albumId, 'stickers', section] as const,
};

export function useAlbums() {
  return useQuery({
    queryKey: albumKeys.all,
    queryFn: albumsRepository.findAll,
  });
}

export function useAlbumStickers(albumId: string, section?: string) {
  return useQuery({
    queryKey: albumKeys.stickers(albumId, section),
    queryFn: () => albumsRepository.findStickers(albumId, section),
    enabled: !!albumId,
  });
}

export function useCreateAlbum() {
  const queryClient = useQueryClient();
  return useMutation<Album, Error, FormData>({
    mutationFn: (formData) => albumsRepository.create(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: albumKeys.all }),
  });
}
