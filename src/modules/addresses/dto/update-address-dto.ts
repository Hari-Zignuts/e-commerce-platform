import { PartialType } from '@nestjs/swagger';
import { CreateAddressDTO } from './create-address-dto';
import { IsOptional } from 'class-validator';

export class UpdateAddressDTO extends PartialType(CreateAddressDTO) {
  @IsOptional()
  street?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  state?: string;

  @IsOptional()
  zip?: string;

  @IsOptional()
  country?: string;
}
