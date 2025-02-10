import { Injectable } from '@nestjs/common';
import { LikeRepository } from './like.repository';
import { LikeProduct } from './like.entity';
import { isUUID } from 'class-validator';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { ReqPayload } from 'src/common/interfaces/req-payload.interface';

@Injectable()
export class LikesService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly userService: UsersService,
    private readonly productService: ProductsService,
  ) {}

  async createLike(userId: string, productId: string) {
    if (!userId || !productId || !isUUID(userId) || !isUUID(productId)) {
      throw new Error('User ID and Product ID are required');
    }
    const like = new LikeProduct();
    const user = await this.userService.getOneUserById(userId);
    const product = await this.productService.getOneProductById(productId);
    like.user = user;
    like.product = product;
    return await this.likeRepository.saveLike(like);
  }

  async getAllLikes(req: ReqPayload) {
    const allProduct = await this.likeRepository.findAllLikes();
    const likedProduct = allProduct.filter(
      (like) => like.user.id === req.user.id,
    );
    return likedProduct;
  }

  async getOneLikeById(id: string) {
    if (!id || !isUUID(id)) {
      throw new Error('Invalid ID');
    }
    return await this.likeRepository.findOneLikeById(id);
  }

  async deleteLike(id: string) {
    if (!id || !isUUID(id)) {
      throw new Error('Invalid ID');
    }
    return await this.likeRepository.deleteLikeProductById(id);
  }
}
