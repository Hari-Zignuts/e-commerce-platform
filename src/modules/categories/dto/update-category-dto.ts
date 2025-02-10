import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateCategoryDTO } from './create-category-dto';

export class UpdateCategoryDTO extends PartialType(CreateCategoryDTO) {
  @IsOptional()
  title: string;

  @IsOptional()
  description?: string;
}
