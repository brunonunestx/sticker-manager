import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../common/decorators/auth.decorator';
import { Role } from '../../generated/prisma/client';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { CreateStickerDto } from './dto/create-sticker.dto';

@ApiTags('albums')
@ApiBearerAuth()
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @Auth(Role.ADMIN)
  create(@Body() dto: CreateAlbumDto) {
    return this.albumsService.create(dto);
  }

  @Get()
  @Auth()
  findAll() {
    return this.albumsService.findAll();
  }

  @Post(':albumId/stickers')
  @Auth(Role.ADMIN)
  createSticker(@Param('albumId') albumId: string, @Body() dto: CreateStickerDto) {
    return this.albumsService.createSticker(albumId, dto);
  }

  @Get(':albumId/stickers')
  @Auth()
  @ApiQuery({ name: 'section', required: false })
  findStickers(@Param('albumId') albumId: string, @Query('section') section?: string) {
    return this.albumsService.findStickers(albumId, section);
  }
}
