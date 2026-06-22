import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({ example: 'Copa do Mundo 2026' })
  @IsString()
  declare name: string;
}
