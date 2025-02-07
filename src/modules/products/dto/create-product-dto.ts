import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ImageDto {
  @ApiProperty({ description: 'The public ID of the image' })
  publicId: string;

  @ApiProperty({ description: 'The URL of the image' })
  url: string;

  @ApiProperty({ description: 'The secure URL of the image', required: false })
  secureUrl?: string;

  @ApiProperty({ description: 'The width of the image', required: false })
  width?: number;

  @ApiProperty({ description: 'The height of the image', required: false })
  height?: number;

  @ApiProperty({ description: 'The format of the image', required: false })
  format?: string;

  @ApiProperty({ description: 'The size of the image', required: false })
  size?: number;

  @ApiProperty({ description: 'The alt text of the image', required: false })
  altText?: string;
}

export class CreateProductDTO {
  @ApiProperty({ description: 'The name of the product', example: 'Product 1' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'Description of product 1',
  })
  description: string;

  @ApiProperty({ description: 'The price of the product', example: 100 })
  price: number;

  @ApiProperty({
    description: 'The category of the product',
    example: 'Category 1',
  })
  category: string;

  @ApiProperty({
    description: 'The stock quantity of the product',
    example: 10,
  })
  stock: number;

  @ApiProperty({
    description: 'The images of the product',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  images: string;
}
