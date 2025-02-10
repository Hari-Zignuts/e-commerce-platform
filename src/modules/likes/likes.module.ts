import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeProduct } from './like.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { LikeRepository } from './like.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeProduct]),
    UsersModule,
    ProductsModule,
  ],
  providers: [LikesService, LikeRepository],
  controllers: [LikesController],
  exports: [LikesService],
})
export class LikesModule {}
