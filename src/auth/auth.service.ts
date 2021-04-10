import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { User } from './entities/auth.entity';

@Injectable()
export class AuthService {
  async register(createAuthDto: CreateUserDto) {
    await User.add(createAuthDto)
    return 'User registered'
  }

  findAll() {
    return `This action returns all auth`
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`
  }

  remove(id: number) {
    return `This action removes a #${id} auth`
  }
}
