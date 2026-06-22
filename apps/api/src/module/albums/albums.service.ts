import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { DatabaseProvider } from '../../providers/database.provider';
import { CreateAlbumDto } from './dto/create-album.dto';
import { CreateStickerDto } from './dto/create-sticker.dto';

@Injectable()
export class AlbumsService {
  constructor(private readonly db: DatabaseProvider) {}

  async create(dto: CreateAlbumDto) {
    return this.db.album.create({ data: { name: dto.name } });
  }

  async findAll() {
    return this.db.album.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findById(albumId: string) {
    const album = await this.db.album.findUnique({ where: { id: albumId } });
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  async createSticker(albumId: string, dto: CreateStickerDto) {
    await this.findById(albumId);

    try {
      return await this.db.sticker.create({
        data: { albumId, code: dto.code, section: dto.section },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException(`Code ${dto.code} already exists in this album`);
      }
      throw err;
    }
  }

  async findStickers(albumId: string, section?: string) {
    await this.findById(albumId);

    return this.db.sticker.findMany({
      where: { albumId, ...(section ? { section } : {}) },
      orderBy: [{ section: 'asc' }, { code: 'asc' }],
    });
  }
}
