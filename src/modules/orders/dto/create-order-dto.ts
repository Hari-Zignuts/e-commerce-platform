import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDTO {
  @ApiProperty({ description: 'The product name', example: 'Laptop' })
  @IsString()
  @IsNotEmpty()
  product: string;

  @ApiProperty({
    description: 'The delivery address',
    example: '123 Main St, Anytown, USA',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'The quantity of the product', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
