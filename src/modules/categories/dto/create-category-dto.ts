import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDTO {
  @ApiProperty({
    description: 'The title of the category',
    maxLength: 50,
    example: 'Electronics',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string;

  @ApiProperty({
    description: 'A brief description of the category',
    maxLength: 255,
    example: 'Category for electronic products',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
