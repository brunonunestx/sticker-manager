import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Auth } from '../../common/decorators/auth.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService, JwtPayload } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RefreshGuard, RefreshRequest } from './guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('refresh')
  @HttpCode(200)
  @UseGuards(RefreshGuard)
  refresh(@Req() req: RefreshRequest, @Body() _dto: RefreshDto) {
    return this.authService.refresh(req.user.sub, req.user.refreshToken);
  }

  @Post('logout')
  @HttpCode(200)
  @Auth()
  logout(@Req() req: Request & { user: JwtPayload }) {
    return this.authService.logout(req.user.sub);
  }
}
