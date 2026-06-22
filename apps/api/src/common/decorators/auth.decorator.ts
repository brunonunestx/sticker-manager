import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../module/auth/guards/jwt-auth.guard';

export const Auth = () => applyDecorators(UseGuards(JwtAuthGuard));
