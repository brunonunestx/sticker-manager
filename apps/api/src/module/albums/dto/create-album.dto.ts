import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({ example: 'Copa do Mundo 2026' })
  @IsString()
  declare name: string;
}

export class CreateAlbumWithStickersBody {
  @ApiProperty({ example: 'Copa do Mundo 2026' })
  declare name: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'JSON file with stickers array: [{ "code": "BRA12", "section": "BRA" }]' })
  declare stickers: Express.Multer.File;
}
