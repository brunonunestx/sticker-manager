import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  declare name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  declare email: string;

  @ApiProperty({ example: 'strongpassword', minLength: 8 })
  @IsString()
  @MinLength(8)
  declare password: string;
}
