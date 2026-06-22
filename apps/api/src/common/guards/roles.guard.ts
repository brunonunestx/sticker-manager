import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../generated/prisma/client';
import { JwtPayload } from '../../module/auth/auth.service';
import { ROLE_KEY } from '../decorators/auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<Role>(ROLE_KEY, context.getHandler());
    if (!requiredRole) return true;

    const req = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    if (req.user?.role !== requiredRole) throw new ForbiddenException();

    return true;
  }
}
