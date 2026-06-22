import { type ChangeEvent, type FormEvent, useRef, useState } from 'react';
import { BookOpen, FileJson, Plus, Upload, X } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@sticker-manager/ui';
import { useCreateAlbum } from '@/data/queries/albums.queries';
import { useAlbums } from '@/data/queries/albums.queries';

function AlbumList() {
  const { data: albums, isLoading } = useAlbums();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-14 rounded-lg border bg-card animate-pulse" />
        ))}
      </div>
    );
  }

  if (!albums?.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Nenhum álbum cadastrado ainda.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {albums.map((album) => (
        <div
          key={album.id}
          className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3"
        >
          <BookOpen size={18} className="text-muted-foreground shrink-0" />
          <span className="text-sm font-medium">{album.name}</span>
        </div>
      ))}
    </div>
  );
}

function CreateAlbumForm({ onCancel }: { onCancel: () => void }) {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const create = useCreateAlbum();

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('stickers', file);

    create.mutate(formData, { onSuccess: onCancel });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Novo álbum</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nome do álbum</Label>
            <Input
              id="name"
              placeholder="Ex: Copa do Mundo 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Arquivo de figurinhas (.json)</Label>
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFile}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
                <FileJson size={16} className="text-muted-foreground shrink-0" />
                <span className="text-sm flex-1 truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center gap-2 rounded-lg border border-dashed bg-muted/30 px-4 py-6 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                <Upload size={20} />
                Clique para selecionar o arquivo
              </button>
            )}
          </div>

          {create.isError && (
            <p className="text-sm text-destructive">{create.error.message}</p>
          )}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel} disabled={create.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!file || create.isPending}>
              {create.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AdminAlbumsPage() {
  const [creating, setCreating] = useState(false);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Álbuns</h1>
        {!creating && (
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus size={16} className="mr-1.5" />
            Novo álbum
          </Button>
        )}
      </div>

      {creating && <CreateAlbumForm onCancel={() => setCreating(false)} />}

      <AlbumList />
    </div>
  );
}
