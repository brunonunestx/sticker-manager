import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { Auth } from '../../common/decorators/auth.decorator';
import { Role } from '../../generated/prisma/client';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto, CreateAlbumWithStickersBody } from './dto/create-album.dto';
import { CreateStickerDto } from './dto/create-sticker.dto';

@ApiTags('albums')
@ApiBearerAuth()
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @Auth(Role.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateAlbumWithStickersBody })
  @UseInterceptors(
    FileInterceptor('stickers', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_, file, cb) => {
        const isJson = file.mimetype === 'application/json' || file.originalname.endsWith('.json');
        cb(isJson ? null : new BadRequestException('Only JSON files are allowed'), isJson);
      },
    }),
  )
  create(@Body() dto: CreateAlbumDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Stickers JSON file is required');
    return this.albumsService.create(dto, file);
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
