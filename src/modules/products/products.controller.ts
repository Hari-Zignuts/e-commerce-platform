import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { CreateProductDTO } from './dto/create-product-dto';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { UpdateProductDTO } from './dto/update-product-dto';
import { RolesGuard } from 'src/common/guards/role.guard';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * @version 1.0.0
   * @route POST /products
   * @function createProduct
   * @description Create a new product
   */
  @Post()
  @UseGuards(RolesGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  @ApiOperation({ summary: 'Create a new product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product data and images',
    required: true,
    type: CreateProductDTO,
  })
  async createProduct(
    @Body() createProductDTO: CreateProductDTO,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: 'image',
          }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    const product = await this.productsService.createProduct(
      createProductDTO,
      files,
    );
    return {
      message: ResponseMessages.PRODUCT.CREATED,
      product,
    };
  }

  /**
   * @version 1.0.0
   * @route GET /products
   * @route GET /products
   * @function getAllProducts
   * @description Find all products
   */
  @Get()
  @ApiOperation({ summary: 'Find all products' })
  async getAllProducts() {
    const products = await this.productsService.getAllProducts();
    return {
      message: ResponseMessages.PRODUCT.FETCHED,
      products,
    };
  }

  /**
   * @version 1.0.0
   * @route GET /products/:id
   * @function getProductById
   * @description Get a product by id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  async getProductById(@Param('id') id: string) {
    const product = await this.productsService.getOneProductById(id);
    return {
      message: ResponseMessages.PRODUCT.FETCHED,
      product,
    };
  }

  /**
   * @version 1.0.0
   * @route PUT /products/:id
   * @function updateProduct
   * @description Update a product by id
   */
  @Put(':id')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update a product by id (admin only)' })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDTO: UpdateProductDTO,
  ) {
    const product = await this.productsService.updateProduct(
      id,
      updateProductDTO,
    );
    return {
      message: ResponseMessages.PRODUCT.UPDATED,
      product,
    };
  }

  /**
   * @version 1.0.0
   * @route DELETE /products/:id
   * @function deleteProductById
   * @description Delete a product by id
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete a product by id (admin only)' })
  async deleteProductById(@Param('id') id: string) {
    const product = await this.productsService.deleteProductById(id);
    return {
      message: ResponseMessages.PRODUCT.DELETE_SUCCESS,
      product,
    };
  }
}
