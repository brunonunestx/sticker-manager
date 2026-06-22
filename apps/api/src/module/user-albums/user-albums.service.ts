import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { DatabaseProvider } from '../../providers/database.provider';
import { AddUserStickerDto } from './dto/add-user-sticker.dto';
import { CreateUserAlbumDto } from './dto/create-user-album.dto';
import { ListUserStickersQuery, StickerFilter } from './dto/list-user-stickers.query';

@Injectable()
export class UserAlbumsService {
  constructor(private readonly db: DatabaseProvider) {}

  async create(userId: string, dto: CreateUserAlbumDto) {
    const album = await this.db.album.findUnique({ where: { id: dto.albumId } });
    if (!album) throw new NotFoundException('Album not found');

    try {
      return await this.db.userAlbum.create({
        data: { userId, albumId: dto.albumId },
        include: { album: true },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('You already have this album');
      }
      throw err;
    }
  }

  async findAllByUser(userId: string) {
    return this.db.userAlbum.findMany({
      where: { userId },
      include: { album: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addSticker(userId: string, userAlbumId: string, dto: AddUserStickerDto) {
    const userAlbum = await this.db.userAlbum.findUnique({ where: { id: userAlbumId } });

    if (!userAlbum || userAlbum.userId !== userId) {
      throw new NotFoundException('User album not found');
    }

    const sticker = await this.db.sticker.findFirst({
      where: { id: dto.stickerId, albumId: userAlbum.albumId },
    });

    if (!sticker) throw new NotFoundException('Sticker not found in this album');

    try {
      return await this.db.userSticker.create({
        data: { userAlbumId, stickerId: dto.stickerId, quantity: dto.quantity ?? 1 },
        include: { sticker: true },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('Sticker already added to this album');
      }
      throw err;
    }
  }

  async findStickers(userId: string, userAlbumId: string, query: ListUserStickersQuery) {
    const userAlbum = await this.db.userAlbum.findUnique({ where: { id: userAlbumId } });

    if (!userAlbum || userAlbum.userId !== userId) {
      throw new NotFoundException('User album not found');
    }

    const { page = 1, limit = 20, code, filter } = query;

    const where: Prisma.StickerWhereInput = {
      albumId: userAlbum.albumId,
      ...(code ? { code: { contains: code, mode: 'insensitive' } } : {}),
      ...(filter === StickerFilter.Missing
        ? { userStickers: { none: { userAlbumId } } }
        : filter === StickerFilter.Repeated
        ? { userStickers: { some: { userAlbumId, quantity: { gt: 1 } } } }
        : {}),
    };

    const [total, stickers] = await this.db.$transaction([
      this.db.sticker.count({ where }),
      this.db.sticker.findMany({
        where,
        include: { userStickers: { where: { userAlbumId } } },
        orderBy: [{ section: 'asc' }, { code: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: stickers.map(({ userStickers, ...sticker }) => ({
        ...sticker,
        userSticker: userStickers[0] ?? null,
      })),
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }
}
