import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeProduct } from './like.entity';
import { ResponseMessages } from 'src/common/constants/response-messages';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectRepository(LikeProduct)
    private readonly likeRepository: Repository<LikeProduct>,
  ) {}

  async saveLike(like: LikeProduct) {
    try {
      return await this.likeRepository.save(like);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message,
      );
    }
  }

  async findAllLikes() {
    try {
      return await this.likeRepository.find({ relations: ['user', 'product'] });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message,
      );
    }
  }

  async findOneLikeById(id: string) {
    try {
      return await this.likeRepository.findOne({
        where: { id },
        relations: ['user', 'product'],
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

  async deleteLikeProductById(id: string) {
    try {
      return await this.likeRepository.delete({ id });
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
