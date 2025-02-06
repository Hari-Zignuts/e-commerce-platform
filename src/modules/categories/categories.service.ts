import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDTO } from './dto/create-category-dto';
import { Category } from './category.entity';
import { ResponseMessages } from 'src/common/constants/response-messages';

@Injectable()
export class CategoriesService {
  constructor(private categoryRepository: CategoryRepository) {}

  async createCategory(category: CreateCategoryDTO): Promise<Category> {
    const newCategory = await this.categoryRepository.createCategory(category);
    if (!newCategory) {
      throw new HttpException(
        ResponseMessages.CATEGORY.CREATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return newCategory;
  }

  async getOneCategoryById(id: string): Promise<Category> {
    const cateogry = await this.categoryRepository.findOneCategoryById(id);
    if (!cateogry) {
      throw new HttpException(
        ResponseMessages.CATEGORY.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return cateogry;
  }

  async deleteOneCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOneCategoryById(id);
    if (!category) {
      throw new HttpException(
        ResponseMessages.CATEGORY.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const deletedCategory =
      await this.categoryRepository.deleteCategoryById(category);
    if (!deletedCategory) {
      throw new HttpException(
        ResponseMessages.CATEGORY.DELETE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return deletedCategory;
  }
}
