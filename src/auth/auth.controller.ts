import {
  Controller,
  Post,
  Body,
  UseFilters,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginDto } from './dto/login.dto'
import { DuplicateFilter } from '../duplicate.filter'
import { UserInterceptor } from '../user.interceptor'
import { ActivityInterceptor } from '../activity.interceptor'
import { NegativeFilter } from '../negative.filter'

@Controller('api/auth')
@UsePipes(new ValidationPipe())
@UseInterceptors(UserInterceptor)
@UseFilters(new DuplicateFilter())
@UseFilters(new NegativeFilter())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createAuthDto: CreateUserDto) {
    return await this.authService.register(createAuthDto)
  }

  @Post('login')
  @UseInterceptors(ActivityInterceptor)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto)
  }
}
