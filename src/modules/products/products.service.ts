import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product-dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Image } from './entities/image.entity';
import { CategoriesService } from '../categories/categories.service';
import { ProductRepository } from './repositories/product.repository';
import { isUUID } from 'class-validator';
import { Product } from './entities/product.entity';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { UpdateProductDTO } from './dto/update-product-dto';
import { Stock } from './entities/stock.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly categoryService: CategoriesService,
    private readonly productRepository: ProductRepository,
  ) {}

  /**
   * @version 1.0.0
   * @function createProduct
   * @description Create a new product
   */
  async createProduct(
    createProductDTO: CreateProductDTO,
    files: Express.Multer.File[],
  ): Promise<Product> {
    // find the category by id
    const category = await this.categoryService.getOneCategoryById(
      createProductDTO.category,
    );
    // create a new product object
    const product = new Product();
    // assign the values from the DTO to the product object
    Object.assign(product, createProductDTO);
    // assign the category and images to the product object
    product.category = category;
    // upload the images to cloud storage
    const images = await this.uploadMultipleImages(files);
    // assign the images to the product object
    product.images = images;

    const stock = new Stock();
    stock.quantity = createProductDTO.stock;
    product.stock = stock;
    // save the product object to the database
    const newProduct = await this.productRepository.saveProduct(product);
    // if the product object is not saved to the database, throw an error
    if (!newProduct) {
      throw new HttpException(
        ResponseMessages.CATEGORY.CREATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // return the saved product object
    return newProduct;
  }

  /**
   * @version 1.0.0
   * @function uploadMultipleImages
   * @description Upload multiple images to cloudinary
   */
  async uploadMultipleImages(files: Express.Multer.File[]): Promise<Image[]> {
    try {
      const images: Image[] = [];
      const uploadedImages =
        await this.cloudinaryService.uploadMultipleImages(files);
      uploadedImages.forEach((uploadedImage) => {
        const newImage = new Image();
        Object.assign(newImage, {
          publicId: uploadedImage.public_id,
          url: uploadedImage.url,
          secureUrl: uploadedImage.secure_url,
          width: uploadedImage.width,
          height: uploadedImage.height,
          format: uploadedImage.format,
          size: uploadedImage.bytes,
          altText: uploadedImage.original_filename,
        });
        images.push(newImage);
      });
      return images;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseMessages.CLOUD.UPLOAD_FAILED,
      );
    }
  }

  /**
   * @version 1.0.0
   * @function uploadSingleImage
   * @description Upload single image to cloud storage
   */
  async uploadSingleImage(file: Express.Multer.File): Promise<Image> {
    try {
      const newImage = await this.cloudinaryService.uploadImage(file);
      const image = new Image();
      Object.assign(image, {
        publicId: newImage.public_id,
        url: newImage.url,
        secureUrl: newImage.secure_url,
        width: newImage.width,
        height: newImage.height,
        format: newImage.format,
        size: newImage.bytes,
        altText: newImage.original_filename,
      });
      return image;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseMessages.CLOUD.UPLOAD_FAILED,
      );
    }
  }

  /**
   * @version 1.0.0
   * @function getOneProductById
   * @description Find a product by ID and return the product object
   */
  async getOneProductById(id: string): Promise<Product> {
    if (!id || !isUUID(id)) {
      throw new HttpException(
        ResponseMessages.PRODUCT.INVALID_ID,
        HttpStatus.BAD_REQUEST,
      );
    }
    const product = await this.productRepository.findOneProductById(id);
    if (!product) {
      throw new HttpException(
        ResponseMessages.PRODUCT.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return product;
  }

  /**
   * @version 1.0.0
   * @function getAllProducts
   * @description Find all products
   */
  async getAllProducts(): Promise<Product[]> {
    const products = await this.productRepository.findAllProducts();
    if (!products) {
      throw new HttpException(
        ResponseMessages.PRODUCT.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return products;
  }

  /**
   * @version 1.0.0
   * @function updateProduct
   * @description Update a product by ID
   */
  async updateProduct(
    id: string,
    updateProductDTO: UpdateProductDTO,
  ): Promise<Product> {
    // Check if any updates were provided
    const hasUpdates = Object.keys(updateProductDTO).length > 0;
    if (!hasUpdates) {
      throw new HttpException(
        ResponseMessages.PRODUCT.NO_UPDATE,
        HttpStatus.BAD_REQUEST,
      );
    }
    // find the product by id
    const product = await this.getOneProductById(id);
    const productStock = product.stock;

    // assign the values from the DTO to the product object
    Object.assign(product, updateProductDTO);

    // find the category by id from the DTO object if it exists and assign it to the product object
    if (updateProductDTO.category) {
      product.category = await this.categoryService.getOneCategoryById(
        updateProductDTO.category,
      );
    }
    if (updateProductDTO.stock) {
      const stock = await this.updateStock(
        productStock.id,
        updateProductDTO.stock,
      );
      product.stock = stock;
    }
    // save the updated product object to the database
    const updatedProduct = await this.productRepository.saveProduct(product);
    // if the product object is not saved to the database, throw an error
    if (!updatedProduct) {
      throw new HttpException(
        ResponseMessages.PRODUCT.NO_UPDATE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // return the updated product object
    return updatedProduct;
  }

  /**
   * @version 1.0.0
   * @function deleteProductById
   * @description Delete a product by ID
   */
  async deleteProductById(id: string): Promise<Product> {
    // find the product by id
    const product = await this.getOneProductById(id);
    // delete the images from cloud storage
    if (product.images.length > 0) {
      await this.cloudinaryService.deleteMultipleImages(product.images);
    }
    // delete the product from the database
    const deletedProduct = await this.productRepository.deleteProduct(product);
    // if the product object is not deleted from the database, throw an error
    if (!deletedProduct) {
      throw new HttpException(
        ResponseMessages.PRODUCT.DELETE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // return the deleted product object
    return deletedProduct;
  }

  /**
   * @version 1.0.0
   * @function getOneStockById
   * @description Find a stock by ID and return the stock object
   */
  async getOneStockById(id: string): Promise<Stock> {
    if (!id || !isUUID(id)) {
      throw new BadRequestException(ResponseMessages.STOCK.INVALID_ID);
    }
    const stock = await this.productRepository.findOneStockById(id);
    if (!stock) {
      throw new HttpException(
        ResponseMessages.STOCK.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return stock;
  }

  async ReduceStock(id: string, quantity: number): Promise<Stock> {
    const stock = await this.getOneStockById(id);
    stock.quantity -= quantity;
    if (stock.quantity < 0) {
      throw new HttpException(
        ResponseMessages.STOCK.NOT_ENOUGH,
        HttpStatus.BAD_REQUEST,
      );
    }
    const newStock = await this.updateStock(stock.id, stock.quantity);
    return newStock;
  }

  /**
   * @version 1.0.0
   * @function updateStock
   * @description Update the stock quantity by ID
   */
  async updateStock(id: string, quantity: number): Promise<Stock> {
    const stock = await this.getOneStockById(id);
    stock.quantity = quantity;
    const newStock = await this.productRepository.updateStock(stock);
    if (!newStock) {
      throw new HttpException(
        ResponseMessages.STOCK.UPDATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return newStock;
  }
}
