import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from './dto/create-user-dto';
import { User } from './user.entity';
import { ResponseMessages } from 'src/common/constants/response-messages';
import * as bcrypt from 'bcrypt';
import { RolesService } from '../roles/roles.service';
import { isUUID } from 'class-validator';
import { UpdateUserDTO } from './dto/update-user-dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rolesService: RolesService,
  ) {}

  async createUser(
    createUserDTO: CreateUserDTO,
    roleName: string,
  ): Promise<User> {
    // Hash the password before saving it to the database
    const salt: string = await bcrypt.genSalt();
    createUserDTO.password = await bcrypt.hash(createUserDTO.password, salt);
    // Create a new user object
    const user = new User();
    // Assign the values from the DTO to the user object
    Object.assign(user, createUserDTO);
    // Get the role from the database
    const role = await this.rolesService.getOneRoleByName(roleName);
    // Check if the role was found
    user.role = role;
    // Save the user to the database
    const newUser = await this.userRepository.saveUser(user);
    // Check if the user was saved
    if (!newUser) {
      throw new HttpException(
        ResponseMessages.USER.CREATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // Return the user
    return newUser;
  }

  /**
   * @version 1.0.0
   * @function getOneUserById
   * @description Find a user by ID and return the user object
   */
  async getOneUserById(id: string): Promise<User> {
    // Check if the ID is valid
    if (!id || !isUUID(id)) {
      throw new HttpException(
        ResponseMessages.USER.INVALID_ID,
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
    return user;
  }

  /**
   * @version 1.0.0
   * @function getOneUserByUsername
   * @description Find a user by username and return the user object
   */
  async getOneUserByUsername(username: string): Promise<User> {
    // Check if the username is valid
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

  /**
   * @version 1.0.0
   * @function getAllUsers
   * @description Get all users from the database
   */
  async getAllUsers(): Promise<User[]> {
    // Get all users from the database
    const users = await this.userRepository.findAllUsers();
    // Check if users were found
    if (!users) {
      throw new HttpException(
        ResponseMessages.USER.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    // Return the users
    return users;
  }

  /**
   * @version 1.0.0
   * @function updateUserById
   * @description Update a user by ID
   */
  async updateUserById(id: string, updateUserDTO: UpdateUserDTO) {
    const user = await this.userRepository.findOneUserById(id);
    if (!user) {
      throw new HttpException(
        ResponseMessages.USER.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const hasUpdates = Object.keys(updateUserDTO).length > 0;
    if (!hasUpdates) {
      throw new HttpException(
        ResponseMessages.USER.NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (updateUserDTO.password) {
      const salt: string = await bcrypt.genSalt();
      updateUserDTO.password = await bcrypt.hash(updateUserDTO.password, salt);
    }

    Object.assign(user, updateUserDTO);
    return await this.userRepository.saveUser(user);
  }

  /**
   * @version 1.0.0
   * @function deleteUserById
   * @description Delete a user by ID
   */
  async deleteUserById(id: string): Promise<User> {
    // Check if the ID is valid
    if (!id || !isUUID(id)) {
      throw new HttpException(
        ResponseMessages.USER.INVALID_ID,
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
    // Delete the user from the database
    const deletedUser = await this.userRepository.deleteUser(user);
    // Check if the user was deleted
    if (!deletedUser) {
      throw new HttpException(
        ResponseMessages.USER.DELETE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // Return the deleted user
    return deletedUser;
  }
}
