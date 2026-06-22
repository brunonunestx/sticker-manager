import { Module } from '@nestjs/common';
import { DatabaseProvider } from '../../providers/database.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [DatabaseProvider, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
