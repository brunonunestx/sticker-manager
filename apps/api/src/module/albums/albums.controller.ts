import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../common/decorators/auth.decorator';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { CreateStickerDto } from './dto/create-sticker.dto';

@ApiTags('albums')
@ApiBearerAuth()
@Auth()
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  create(@Body() dto: CreateAlbumDto) {
    return this.albumsService.create(dto);
  }

  @Get()
  findAll() {
    return this.albumsService.findAll();
  }

  @Post(':albumId/stickers')
  createSticker(@Param('albumId') albumId: string, @Body() dto: CreateStickerDto) {
    return this.albumsService.createSticker(albumId, dto);
  }

  @Get(':albumId/stickers')
  @ApiQuery({ name: 'section', required: false })
  findStickers(@Param('albumId') albumId: string, @Query('section') section?: string) {
    return this.albumsService.findStickers(albumId, section);
  }
}
