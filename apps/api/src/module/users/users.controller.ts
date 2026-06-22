import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { Auth } from '../../common/decorators/auth.decorator';
import { JwtPayload } from '../auth/auth.service';
import { UsersService } from './users.service';

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @Auth()
  async me(@Req() req: AuthenticatedRequest) {
    return this.usersService.findById(req.user.sub);
  }
}
