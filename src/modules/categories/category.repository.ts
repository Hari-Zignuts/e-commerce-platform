import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { IsNull, Repository } from 'typeorm';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { CreateCategoryDTO } from './dto/create-category-dto';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createCategory(category: CreateCategoryDTO): Promise<Category> {
    try {
      return await this.categoryRepository.save(category);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneCategoryById(id: string): Promise<Category | null> {
    try {
      return await this.categoryRepository.findOneBy({
        id,
        deletedAt: IsNull(),
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteCategoryById(category: Category): Promise<Category> {
    try {
      return await this.categoryRepository.softRemove(category);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
