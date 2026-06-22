import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseProvider } from '../../providers/database.provider';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseProvider) {}

  async create(dto: CreateUserDto) {
    const exists = await this.db.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const { passwordHash: _, refreshToken: __, ...user } = await this.db.user.create({
      data: { name: dto.name, email: dto.email, passwordHash },
    });

    return user;
  }

  async findByEmail(email: string) {
    return this.db.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.db.user.findUnique({ where: { id } });
  }

  async updateRefreshToken(id: string, token: string | null) {
    const refreshToken = token ? await bcrypt.hash(token, 10) : null;
    await this.db.user.update({ where: { id }, data: { refreshToken } });
  }
}
