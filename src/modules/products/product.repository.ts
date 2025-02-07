import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dto/create-product-dto';
import { Image } from './entities/image.entity';
import { Category } from '../categories/category.entity';
import { Stock } from './entities/stock.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  async createProduct(
    createProductDTO: CreateProductDTO,
    category: Category,
    images: Image[],
  ) {
    const product = this.productRepository.create({
      title: createProductDTO.title,
      description: createProductDTO.description,
      price: createProductDTO.price,
      stock: { stock: createProductDTO.stock },
      category: category,
      images,
    });
    await this.productRepository.save(product);

    return await this.productRepository.findOne({
      where: { id: product.id },
      relations: ['category', 'images'],
    });
  }

  async findOneProductById(id: string) {
    return await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'images', 'stock'],
    });
  }

  async deleteProductById(product: Product) {
    return await this.productRepository.softRemove(product);
  }

  async updateProduct(product: Product) {
    return await this.productRepository.save(product);
  }

  async findOneStockById(id: string) {
    return await this.stockRepository.findOne({
      where: { id },
    });
  }

  async updateStock(stock: Stock) {
    return await this.stockRepository.save(stock);
  }
}
