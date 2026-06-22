import { Module } from '@nestjs/common';
import { AlbumsModule } from './module/albums/albums.module';
import { AuthModule } from './module/auth/auth.module';
import { UserAlbumsModule } from './module/user-albums/user-albums.module';
import { UsersModule } from './module/users/users.module';

@Module({
  imports: [UsersModule, AuthModule, AlbumsModule, UserAlbumsModule],
})
export class AppModule {}
