import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum StickerFilter {
  Missing = 'missing',
  Repeated = 'repeated',
}

export class ListUserStickersQuery {
  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({ required: false, description: 'Search by sticker code (ex: BRA12)' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ required: false, enum: StickerFilter, description: 'missing = not collected, repeated = quantity > 1' })
  @IsOptional()
  @IsEnum(StickerFilter)
  filter?: StickerFilter;
}
