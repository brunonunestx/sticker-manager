import { BookOpen, ChevronRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { UserAlbum } from '@/data/repositories/user-albums.repository';
import { useUserAlbums } from '@/data/queries/user-albums.queries';

function AlbumCard({ userAlbum }: { userAlbum: UserAlbum }) {
  return (
    <Link
      to={`/collection/${userAlbum.id}`}
      className="group flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent"
    >
      <div className="flex items-center justify-center rounded-lg bg-muted h-16">
        <BookOpen className="text-muted-foreground" size={28} />
      </div>
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium leading-tight line-clamp-2">
          {userAlbum.album.name}
        </span>
        <ChevronRight
          size={16}
          className="text-muted-foreground shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform"
        />
      </div>
    </Link>
  );
}

function AlbumCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 flex flex-col gap-3 animate-pulse">
      <div className="rounded-lg bg-muted h-16" />
      <div className="h-4 rounded bg-muted w-3/4" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="rounded-full bg-muted p-5">
        <BookOpen size={32} className="text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">Nenhum álbum ainda</p>
        <p className="text-sm text-muted-foreground">Adicione um álbum para começar sua coleção</p>
      </div>
      <Link
        to="/albums/browse"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <Plus size={16} />
        Buscar álbuns
      </Link>
    </div>
  );
}

export default function AlbumsPage() {
  const { data: albums, isLoading } = useUserAlbums();

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Meus álbuns</h1>
        <Link
          to="/albums/browse"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
        </Link>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <AlbumCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && !albums?.length && <EmptyState />}

      {!isLoading && !!albums?.length && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {albums.map((userAlbum) => (
            <AlbumCard key={userAlbum.id} userAlbum={userAlbum} />
          ))}
        </div>
      )}
    </div>
  );
}
