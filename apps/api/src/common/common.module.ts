import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../module/auth/guards/jwt-auth.guard';

@Module({
  imports: [JwtModule.register({})],
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule],
})
export class CommonModule {}
