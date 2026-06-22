import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  declare email: string;

  @ApiProperty({ example: 'strongpassword' })
  @IsString()
  declare password: string;
}
