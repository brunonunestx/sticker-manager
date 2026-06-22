import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { DatabaseProvider } from '../../providers/database.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [CommonModule],
  controllers: [UsersController],
  providers: [DatabaseProvider, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
