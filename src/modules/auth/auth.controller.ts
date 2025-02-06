import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { User } from '../users/user.entity';
import { CreateUserDTO } from '../users/dto/create-user-dto';
import { LoginDTO } from './dto/login-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Signup User' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseMessages.AUTH.SIGNUP_SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  async createUser(
    @Body() createUserDto: CreateUserDTO,
  ): Promise<{ message: string; data: User }> {
    const newUser = await this.authService.signup(createUserDto);
    return {
      message: ResponseMessages.AUTH.SIGNUP_SUCCESS,
      data: newUser,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessages.AUTH.LOGIN_SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  async login(
    @Body() loginDTO: LoginDTO,
  ): Promise<{ message: string; jwt: string }> {
    const access_token = await this.authService.login(loginDTO);
    return {
      message: ResponseMessages.AUTH.LOGIN_SUCCESS,
      jwt: access_token,
    };
  }
}
