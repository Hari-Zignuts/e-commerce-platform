import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './user.entity';
import { ResponseMessages } from 'src/common/constants/response-messages';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * @version 1.0.0
   * @function saveUser
   * @description Save or Update a user in the database
   */
  async saveUser(user: User): Promise<User | null> {
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      // Handle duplicate username or email here
      if (
        error instanceof QueryFailedError &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.driverError.code === '23505'
      ) {
        throw new HttpException(
          ResponseMessages.USER.DUPLICATE,
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      // Handle other database errors here
      throw new InternalServerErrorException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message,
      );
    }
  }

  /**
   * @version 1.0.0
   * @function findOneUserById
   * @description Find a user by ID and return the user object
   */
  async findOneUserById(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: { id: id },
        relations: ['role'],
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
   * @function findOneUserByUsername
   * @description Find a user by username and return the user object
   */
  async findOneUserByUsername(username: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: { username },
        relations: ['role'],
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
   * @function findAllUsers
   * @description Find all users and return an array of user objects
   */
  async findAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        relations: ['role'],
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
   * @function deleteUser
   * @description Delete a user
   */
  async deleteUser(user: User): Promise<User> {
    try {
      return await this.userRepository.remove(user);
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
