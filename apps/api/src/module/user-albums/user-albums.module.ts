import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { DatabaseProvider } from '../../providers/database.provider';
import { UserAlbumsController } from './user-albums.controller';
import { UserAlbumsService } from './user-albums.service';

@Module({
  imports: [CommonModule],
  controllers: [UserAlbumsController],
  providers: [DatabaseProvider, UserAlbumsService],
})
export class UserAlbumsModule {}
