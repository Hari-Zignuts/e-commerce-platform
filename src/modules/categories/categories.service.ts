import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDTO } from './dto/create-category-dto';
import { Category } from './category.entity';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { isUUID } from 'class-validator';
import { UpdateCategoryDTO } from './dto/update-category-dto';

@Injectable()
export class CategoriesService {
  constructor(private categoryRepository: CategoryRepository) {}

  /**
   * @version 1.0.0
   * @function createCategory
   * @description Create a new category
   */
  async createCategory(
    createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    // create a new category object
    const category = new Category();
    // assign the values from the DTO to the category object
    Object.assign(category, createCategoryDTO);
    // save the category object to the database
    const newCategory = await this.categoryRepository.saveCategory(category);
    // if the category object is not saved to the database, throw an error
    if (!newCategory) {
      throw new HttpException(
        ResponseMessages.CATEGORY.CREATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // return the saved category object
    return newCategory;
  }

  /**
   * @version 1.0.0
   * @function getAllCategories
   * @description Find all categories
   */
  async getAllCategories(): Promise<Category[]> {
    const categories = await this.categoryRepository.findAllCategories();
    if (!categories) {
      throw new HttpException(
        ResponseMessages.CATEGORY.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return categories;
  }

  /**
   * @version 1.0.0
   * @function getAllCategories
   * @description Find all categories
   */
  async getOneCategoryById(id: string): Promise<Category> {
    if (!id || !isUUID(id)) {
      throw new HttpException(
        ResponseMessages.CATEGORY.INVALID_ID,
        HttpStatus.BAD_REQUEST,
      );
    }
    const cateogry = await this.categoryRepository.findOneCategoryById(id);
    if (!cateogry) {
      throw new HttpException(
        ResponseMessages.CATEGORY.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return cateogry;
  }

  async updateOneCategoryById(
    id: string,
    updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<Category> {
    // Check if any updates were provided
    const hasUpdates = Object.keys(updateCategoryDTO).length > 0;
    if (!hasUpdates) {
      throw new HttpException(
        ResponseMessages.ADDRESS.NO_UPDATE,
        HttpStatus.BAD_REQUEST,
      );
    }
    // get the category from the database
    const category = await this.getOneCategoryById(id);
    // assign the values from the DTO to the category object
    Object.assign(category, updateCategoryDTO);
    // save the category object to the database
    const updatedCategory =
      await this.categoryRepository.saveCategory(category);
    // if the category object is not saved to the database, throw an error
    if (!updatedCategory) {
      throw new HttpException(
        ResponseMessages.CATEGORY.UPDATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return updatedCategory;
  }

  /**
   * @version 1.0.0
   * @function deleteOneCategoryById
   * @description Delete a category by ID
   */
  async deleteOneCategoryById(id: string): Promise<Category> {
    // get the category from the database
    const category = await this.getOneCategoryById(id);
    // delete the category from the database
    const deletedCategory =
      await this.categoryRepository.deleteCategory(category);
    if (!deletedCategory) {
      throw new HttpException(
        ResponseMessages.CATEGORY.DELETE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return deletedCategory;
  }
}
