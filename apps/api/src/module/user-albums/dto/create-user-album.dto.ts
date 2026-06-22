import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserAlbumDto {
  @ApiProperty()
  @IsString()
  declare albumId: string;
}
