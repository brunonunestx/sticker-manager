import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { DatabaseProvider } from '../../providers/database.provider';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';

@Module({
  imports: [CommonModule],
  controllers: [AlbumsController],
  providers: [DatabaseProvider, AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
