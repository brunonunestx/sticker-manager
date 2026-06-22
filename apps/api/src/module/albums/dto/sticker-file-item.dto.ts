import { IsString } from 'class-validator';

export class StickerFileItemDto {
  @IsString()
  declare code: string;

  @IsString()
  declare section: string;
}
