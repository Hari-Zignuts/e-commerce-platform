import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { IsNull, Repository } from 'typeorm';
import { ResponseMessages } from 'src/common/constants/response-messages';
@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  /**
   * @version 1.0.0
   * @function saveCategory
   * @description Save or Update a category in the database
   */
  async saveCategory(category: Category): Promise<Category> {
    try {
      return await this.categoryRepository.save(category);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message,
      );
    }
  }

  /**
   * @version 1.0.0
   * @function findAllCategories
   * @description Find all categories
   */
  async findAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find({
        where: {
          deletedAt: IsNull(),
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message,
      );
    }
  }

  /**
   * @version 1.0.0
   * @function findOneCategoryById
   * @description Find a category by ID and return the category object
   */
  async findOneCategoryById(id: string): Promise<Category | null> {
    try {
      return await this.categoryRepository.findOne({
        where: {
          id: id,
          deletedAt: IsNull(),
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message,
      );
    }
  }

  /**
   * @version 1.0.0
   * @function deleteCategory
   * @description Delete a category
   */
  async deleteCategory(category: Category): Promise<Category> {
    try {
      return await this.categoryRepository.remove(category);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
