import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dto/create-category-dto';
import { Category } from './category.entity';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UpdateCategoryDTO } from './dto/update-category-dto';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  /**
   * @version 1.0.0
   * @route POST /categories
   * @function createCategory
   * @description Create a new category
   */
  @Post()
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new category (admin only)' })
  async createCategory(
    @Body() createCategoryDTO: CreateCategoryDTO,
  ): Promise<{ message: string; data: Category }> {
    const newCategory =
      await this.categoryService.createCategory(createCategoryDTO);
    return {
      message: ResponseMessages.CATEGORY.CREATED,
      data: newCategory,
    };
  }

  /**
   * @version 1.0.0
   * @route GET /categories
   * @function getAllCategories
   * @description Get all categories
   */
  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  async getAllCategories(): Promise<{ message: string; data: Category[] }> {
    const categories = await this.categoryService.getAllCategories();
    return {
      message: ResponseMessages.CATEGORY.FETCHED_ALL,
      data: categories,
    };
  }

  /**
   * @version 1.0.0
   * @route GET /categories/{id}
   * @function getOneCategoryById
   * @description Get a category by ID
   */
  @Get('id/:id')
  @ApiOperation({ summary: 'Get a category by ID' })
  async getOneCategoryById(
    @Param('id') id: string,
  ): Promise<{ message: string; data: Category }> {
    const category = await this.categoryService.getOneCategoryById(id);
    return {
      message: ResponseMessages.CATEGORY.FETCHED,
      data: category,
    };
  }

  /**
   * @version 1.0.0
   * @route PUT /categories/{id}
   * @function updateCategory
   * @description Update a category by ID
   */
  @Put(':id')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update a category by ID (admin only)' })
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<{ message: string; data: Category }> {
    const updatedCategory = await this.categoryService.updateOneCategoryById(
      id,
      updateCategoryDTO,
    );
    return {
      message: ResponseMessages.CATEGORY.UPDATE_SUCCESS,
      data: updatedCategory,
    };
  }

  /**
   * @version 1.0.0
   * @route DELETE /categories/{id}
   * @function deleteOneCategoryById
   * @description Delete a category by ID
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete a category by ID (admin only)' })
  async deleteOneCategoryById(
    @Param('id') id: string,
  ): Promise<{ message: string; data: Category }> {
    const deletedCategory =
      await this.categoryService.deleteOneCategoryById(id);
    return {
      message: ResponseMessages.CATEGORY.DELETE_SUCCESS,
      data: deletedCategory,
    };
  }
}
