import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshGuard } from './guards/refresh.guard';

@Module({
  imports: [CommonModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, RefreshGuard],
})
export class AuthModule {}
