import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CategoriesModule } from '../categories/categories.module';
import { ProductRepository } from './repositories/product.repository';
import { Stock } from './entities/stock.entity';
import { StockRepository } from './repositories/stock.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Stock]),
    CloudinaryModule,
    CategoriesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductRepository, StockRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
