import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Auth } from '../../common/decorators/auth.decorator';
import { JwtPayload } from '../auth/auth.service';
import { AddUserStickerDto } from './dto/add-user-sticker.dto';
import { CreateUserAlbumDto } from './dto/create-user-album.dto';
import { ListUserStickersQuery } from './dto/list-user-stickers.query';
import { UserAlbumsService } from './user-albums.service';

type AuthRequest = Request & { user: JwtPayload };

@ApiTags('user-albums')
@ApiBearerAuth()
@Auth()
@Controller('user-albums')
export class UserAlbumsController {
  constructor(private readonly userAlbumsService: UserAlbumsService) {}

  @Post()
  create(@Req() req: AuthRequest, @Body() dto: CreateUserAlbumDto) {
    return this.userAlbumsService.create(req.user.sub, dto);
  }

  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.userAlbumsService.findAllByUser(req.user.sub);
  }

  @Post(':userAlbumId/stickers')
  addSticker(
    @Req() req: AuthRequest,
    @Param('userAlbumId') userAlbumId: string,
    @Body() dto: AddUserStickerDto,
  ) {
    return this.userAlbumsService.addSticker(req.user.sub, userAlbumId, dto);
  }

  @Get(':userAlbumId/stickers')
  findStickers(
    @Req() req: AuthRequest,
    @Param('userAlbumId') userAlbumId: string,
    @Query() query: ListUserStickersQuery,
  ) {
    return this.userAlbumsService.findStickers(req.user.sub, userAlbumId, query);
  }
}
