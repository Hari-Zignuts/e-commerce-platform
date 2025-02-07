import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.route.path === '/auth/login' ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.route.path === '/auth/signup'
    ) {
      return true;
    }

    return super.canActivate(context);
  }
}
