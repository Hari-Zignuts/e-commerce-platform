import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateUserDTO } from './create-user-dto';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @IsOptional()
  username?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  password?: string;
}
