import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../../module/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const ROLE_KEY = 'role';

export const Auth = (role?: Role) =>
  applyDecorators(
    ...(role ? [SetMetadata(ROLE_KEY, role)] : []),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
