import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dto/create-category-dto';
import { Category } from './category.entity';
import { ResponseMessages } from 'src/common/constants/response-messages';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
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

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully fetched.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async getOneCategoryById(
    @Param('id') id: string,
  ): Promise<{ message: string; data: Category }> {
    const category = await this.categoryService.getOneCategoryById(id);
    return {
      message: ResponseMessages.CATEGORY.FETCHED,
      data: category,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
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
