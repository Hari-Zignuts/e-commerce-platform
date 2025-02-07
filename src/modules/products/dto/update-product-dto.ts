import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDTO } from './create-product-dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProductDTO extends PartialType(CreateProductDTO) {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Product 1',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'Description of product 1',
    required: false,
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 100,
    required: false,
  })
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'The category of the product',
    example: 'Category 1',
    required: false,
  })
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'The stock quantity of the product',
    example: 10,
    required: false,
  })
  @IsOptional()
  stock?: number;
}
