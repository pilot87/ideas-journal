import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  UseFilters,
  UseInterceptors,
  Req,
} from '@nestjs/common'

import { ProfileService } from './profile.service'
import { ChangeEmailDto } from './dto/change-email.dto'
import { AuthGuard } from '../auth.guard'
import { DuplicateFilter } from '../duplicate.filter'
import { NegativeFilter } from '../negative.filter'
import { UserInterceptor } from '../user.interceptor'
import { ActivityInterceptor } from '../activity.interceptor'
import { Request } from 'express'
import { ChangePasswordDto } from './dto/change-passwd.dto'

@Controller('api/profile')
@UsePipes(new ValidationPipe())
@UseFilters(new DuplicateFilter())
@UseFilters(new NegativeFilter())
@UseInterceptors(UserInterceptor)
@UseInterceptors(ActivityInterceptor)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('chemail')
  @UseGuards(AuthGuard)
  async chemail(@Body() changeEmailDto: ChangeEmailDto, @Req() req: Request) {
    return await this.profileService.chemail(
      changeEmailDto,
      <string>req.headers.user,
      <string>req.headers.session,
    )
  }

  @Post('chpasswd')
  @UseGuards(AuthGuard)
  async chpasswd(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
  ) {
    return await this.profileService.chpasswd(
      changePasswordDto,
      <string>req.headers.user,
    )
  }
}
