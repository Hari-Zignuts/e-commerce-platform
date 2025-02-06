import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDTO } from './dto/create-user-dto';
import { UsersService } from './users.service';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { User } from './user.entity';
import { isUUID } from 'class-validator';

@ApiTags('users')
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
    @Body() createUserDto: CreateUserDTO,
  ): Promise<{ message: string; data: User }> {
    const newUser = await this.usersService.createUser(createUserDto);
    return {
      message: ResponseMessages.USER.CREATED,
      data: newUser,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessages.USER.FETCHED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ResponseMessages.GENERAL.INVALID_DATA,
  })
  async getOneUserById(@Param('id') id: string): Promise<User> {
    if (!id || !isUUID(id)) {
      throw new HttpException(
        ResponseMessages.GENERAL.INVALID_DATA,
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.usersService.getOneUserById(id);
    return user;
  }
}
