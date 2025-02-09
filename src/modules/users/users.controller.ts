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

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
   * @function getOneUserById
   * @description Find a user by ID and return the user object
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a user by ID' })
  async getOneUserById(@Param('id') id: string): Promise<UserResponseDTO> {
    const user = await this.usersService.getOneUserById(id);
    return plainToInstance(UserResponseDTO, user, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a user by ID' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    // call the service method to update the user
    return await this.usersService.updateUserById(id, updateUserDTO);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a user by ID' })
  async deleteUser(@Param('id') id: string) {
    // call the service method to delete the user
    return await this.usersService.deleteUserById(id);
  }
}
