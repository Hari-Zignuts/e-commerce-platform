import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDTO } from '../users/dto/create-user-dto';
import { User } from '../users/user.entity';
import { LoginDTO } from './dto/login-dto';
import * as bcrypt from 'bcrypt';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { JwtService } from '@nestjs/jwt';
import { PayloadType } from 'src/common/interfaces/payload.interface';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDTO): Promise<User> {
    return this.usersService.createUser(createUserDto, 'user');
  }

  async login(loginDTO: LoginDTO): Promise<string> {
    const user = await this.usersService.getOneUserByUsername(
      loginDTO.username,
    );
    if (!user) {
      throw new HttpException(
        ResponseMessages.AUTH.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isPasswordMatch = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new HttpException(
        ResponseMessages.AUTH.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload: PayloadType = {
      id: user.id,
      username: user.username,
      role: user.role.name,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return this.jwtService.sign(payload);
  }
}
