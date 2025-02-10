import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { Stock } from '../entities/stock.entity';
import { ResponseMessages } from 'src/common/constants/response-messages';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  /**
   * @version 1.0.0
   * @function saveProduct
   * @description Save a new product to the database
   */
  async saveProduct(product: Product) {
    try {
      return await this.productRepository.save(product);
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
   * @function findOneProductById
   * @description Find a product by ID and return the product object
   */
  async findOneProductById(id: string) {
    try {
      return await this.productRepository.findOne({
        where: { id },
        relations: ['category', 'images', 'stock'],
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
   * @function findAllProducts
   * @description Find all products in the database
   */
  async findAllProducts() {
    try {
      return await this.productRepository.find({
        relations: ['category', 'images', 'stock'],
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
   * @function deleteProduct
   * @description Delete a product from the database
   */
  async deleteProduct(product: Product) {
    try {
      return await this.productRepository.remove(product);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message,
      );
    }
  }

  async findOneStockById(id: string) {
    try {
      return await this.stockRepository.findOne({
        where: { id },
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

  async updateStock(stock: Stock) {
    try {
      return await this.stockRepository.save(stock);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message,
      );
    }
  }
}
