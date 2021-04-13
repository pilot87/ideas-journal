import {
  Controller,
  Get,
  Post,
  Body,
  UseFilters,
  UsePipes,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginDto } from './dto/login.dto'
import { DuplicateFilter } from './duplicate.filter'
import { AuthGuard } from '../auth.guard'
import { UserInterceptor } from '../user.interceptor'
import { ActivityInterceptor } from '../activity.interceptor'

@Controller('api/auth')
@UsePipes(new ValidationPipe())
@UseInterceptors(UserInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseFilters(new DuplicateFilter())
  register(@Body() createAuthDto: CreateUserDto) {
    return this.authService.register(createAuthDto)
  }

  @Post('login')
  @UseFilters(new DuplicateFilter())
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Get('cleanTestsUsers')
  @UseGuards(AuthGuard)
  @UseInterceptors(ActivityInterceptor)
  clean() {
    return this.authService.clean()
  }
}
