import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({ description: 'User username', example: 'john_doe' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
