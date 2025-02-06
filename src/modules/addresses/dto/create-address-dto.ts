import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateAddressDTO {
  @ApiProperty({
    example: '1234 Elm St',
    description: 'The street address',
  })
  @IsString()
  @Length(1, 50)
  street: string;

  @ApiProperty({
    example: 'Springfield',
    description: 'The city',
  })
  @IsString()
  @Length(1, 50)
  city: string;

  @ApiProperty({
    example: 'IL',
    description: 'The state',
  })
  @IsString()
  @Length(2, 50)
  state: string;

  @ApiProperty({
    example: '12345',
    description: 'The zip code',
  })
  @IsString()
  @Length(5, 50)
  zip: string;

  @ApiProperty({
    example: 'India',
    description: 'The country',
  })
  @IsString()
  @Length(1, 50)
  country: string;
}
