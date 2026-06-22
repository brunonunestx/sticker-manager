import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AddUserStickerDto {
  @ApiProperty()
  @IsString()
  declare stickerId: string;

  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;
}
