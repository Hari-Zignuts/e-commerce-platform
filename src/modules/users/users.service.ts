import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from './dto/create-user-dto';
import { User } from './user.entity';
import { ResponseMessages } from 'src/common/constants/response-messages';
import * as bcrypt from 'bcrypt';
import { RolesService } from '../roles/roles.service';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
    private readonly rolesService: RolesService,
  ) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    // Hash the password before saving it to the database
    const salt: string = await bcrypt.genSalt();
    createUserDTO.password = await bcrypt.hash(createUserDTO.password, salt);
    // Save the user to the database
    const user = new User();
    user.username = createUserDTO.username;
    user.password = createUserDTO.password;
    user.firstName = createUserDTO.firstName;
    user.lastName = createUserDTO.lastName;
    user.email = createUserDTO.email;

    // Create a new query runner for the transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const role = await this.rolesService.getOneRoleByName('user');
      user.role = role;
      const newUser = await this.userRepository.createUser(user);
      const saveuser = await queryRunner.manager.save(newUser);
      await queryRunner.commitTransaction();
      if (!saveuser) {
        throw new HttpException(
          ResponseMessages.USER.CREATE_FAILED,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return saveuser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getOneUserById(id: string): Promise<User> {
    if (!id) {
      throw new HttpException(
        ResponseMessages.GENERAL.INVALID_DATA,
        HttpStatus.BAD_REQUEST,
      );
    }
    // Get the user from the database
    const user = await this.userRepository.findOneUserById(id);
    // Check if the user was found
    if (!user) {
      throw new HttpException(
        ResponseMessages.USER.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    // Return the user
    return user;
  }

  async getOneUserByUsername(username: string): Promise<User> {
    if (!username) {
      throw new HttpException(
        ResponseMessages.GENERAL.INVALID_DATA,
        HttpStatus.BAD_REQUEST,
      );
    }
    // Get the user from the database
    const user = await this.userRepository.findOneUserByUsername(username);
    // Check if the user was found
    if (!user) {
      throw new HttpException(
        ResponseMessages.USER.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    // Return the user
    return user;
  }
}
