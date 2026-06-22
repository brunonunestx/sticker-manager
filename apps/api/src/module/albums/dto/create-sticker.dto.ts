import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateStickerDto {
  @ApiProperty({ example: 'BRA12' })
  @IsString()
  declare code: string;

  @ApiProperty({ example: 'BRA' })
  @IsString()
  declare section: string;
}
