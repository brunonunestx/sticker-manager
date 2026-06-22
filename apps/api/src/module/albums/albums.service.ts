import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Prisma } from '../../generated/prisma/client';
import { DatabaseProvider } from '../../providers/database.provider';
import { CreateAlbumDto } from './dto/create-album.dto';
import { CreateStickerDto } from './dto/create-sticker.dto';
import { StickerFileItemDto } from './dto/sticker-file-item.dto';

@Injectable()
export class AlbumsService {
  constructor(private readonly db: DatabaseProvider) {}

  async create(dto: CreateAlbumDto, file: Express.Multer.File) {
    const stickers = await this.parseStickersFile(file);

    return this.db.$transaction(async (tx) => {
      const album = await tx.album.create({ data: { name: dto.name } });

      await tx.sticker.createMany({
        data: stickers.map((s) => ({ albumId: album.id, code: s.code, section: s.section })),
      });

      return tx.album.findUnique({
        where: { id: album.id },
        include: { _count: { select: { stickers: true } } },
      });
    });
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

  private async parseStickersFile(file: Express.Multer.File): Promise<StickerFileItemDto[]> {
    let raw: unknown;

    try {
      raw = JSON.parse(file.buffer.toString('utf-8'));
    } catch {
      throw new BadRequestException('Invalid JSON file');
    }

    if (!Array.isArray(raw) || raw.length === 0) {
      throw new BadRequestException('File must be a non-empty JSON array');
    }

    const items = plainToInstance(StickerFileItemDto, raw);
    const errors = (await Promise.all(items.map((item) => validate(item)))).flat();

    if (errors.length > 0) {
      throw new BadRequestException(
        `Invalid sticker data: ${errors.map((e) => Object.values(e.constraints ?? {}).join(', ')).join('; ')}`,
      );
    }

    return items;
  }
}
