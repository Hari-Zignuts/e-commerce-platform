import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateUserDTO } from './dto/create-user-dto';
import { UsersService } from './users.service';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { User } from './user.entity';
import { UserResponseDTO } from './dto/user-response-dto';
import { UpdateUserDTO } from './dto/update-user-dto';
import { plainToInstance } from 'class-transformer';
import { RolesGuard } from 'src/common/guards/role.guard';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @version 1.0.0
   * @route POST /users
   * @function createUser
   * @description Create a new user
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseMessages.USER.CREATED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  async createUser(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<{ message: string; data: User }> {
    const newUser = await this.usersService.createUser(createUserDTO, 'user');
    return {
      message: ResponseMessages.USER.CREATED,
      data: newUser,
    };
  }

  /**
   * @version 1.0.0
   * @route GET /users/{id}
   * @function getOneUserById
   * @description Find a user by ID and return the user object without the password
   */
  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a user by ID' })
  async getOneUserById(
    @Param('id') id: string,
  ): Promise<{ message: string; data: UserResponseDTO }> {
    const user = await this.usersService.getOneUserById(id);
    // Transform the user entity to UserResponseDTO
    const filterUser = plainToInstance(UserResponseDTO, user, {
      excludeExtraneousValues: true,
    });
    return {
      message: ResponseMessages.USER.FETCHED,
      data: filterUser,
    };
  }

  @Get('username/:username')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a user by username' })
  async getOneUserByUsername(
    @Param('username') username: string,
  ): Promise<{ message: string; data: UserResponseDTO }> {
    const user = await this.usersService.getOneUserByUsername(username);
    const filterUser = plainToInstance(UserResponseDTO, user, {
      excludeExtraneousValues: true,
    });
    return {
      message: ResponseMessages.USER.FETCHED,
      data: filterUser,
    };
  }

  /**
   * @version 1.0.0
   * @route PUT /users/{id}
   * @function updateUser
   * @description Update a user by ID
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a user by ID' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    // call the service method to update the user
    const user = await this.usersService.updateUserById(id, updateUserDTO);
    return {
      message: ResponseMessages.USER.UPDATE_SUCCESS,
      data: user,
    };
  }

  /**
   * @version 1.0.0
   * @route DELETE /users/{id}
   * @function deleteUser
   * @description Delete a user by ID
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a user by ID' })
  async deleteUser(@Param('id') id: string) {
    // call the service method to delete the user
    const user = await this.usersService.deleteUserById(id);
    return {
      message: ResponseMessages.USER.DELETE_SUCCESS,
      data: user,
    };
  }

  /**
   * @version 1.0.0
   * @route GET /users
   * @function getAllUsers
   * @description Get all users
   */
  @Get()
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users (admin only)' })
  async getAllUsers(): Promise<{ message: string; data: UserResponseDTO[] }> {
    const users = await this.usersService.getAllUsers();
    const filterUsers = users.map((user) =>
      plainToInstance(UserResponseDTO, user, {
        excludeExtraneousValues: true,
      }),
    );
    return {
      message: ResponseMessages.USER.FETCHED,
      data: filterUsers,
    };
  }
}
