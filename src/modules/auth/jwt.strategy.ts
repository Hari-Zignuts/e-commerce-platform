import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadType } from 'src/common/interfaces/payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'jwt_secret',
    });
  }

  validate(payload: PayloadType) {
    return {
      id: payload.id,
      username: payload.username,
      role: payload.role,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };
  }
}
