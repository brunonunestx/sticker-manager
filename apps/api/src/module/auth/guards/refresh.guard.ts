import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../auth.service';

export interface RefreshRequest extends Request {
  user: JwtPayload & { refreshToken: string };
}

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token: string | undefined = (req.body as { refreshToken?: string }).refreshToken;

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env['JWT_REFRESH_SECRET'],
      });
      (req as RefreshRequest).user = { ...payload, refreshToken: token };
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
