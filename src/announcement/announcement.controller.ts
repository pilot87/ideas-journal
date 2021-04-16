import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  UseFilters,
  UseInterceptors,
  Req,
} from '@nestjs/common'
import { AnnouncementService } from './announcement.service'
import { CreateAnnouncementDto } from './dto/create-announcement.dto'
import { UpdateAnnouncementDto } from './dto/update-announcement.dto'
import { AuthGuard } from '../auth.guard'
import { DuplicateFilter } from '../duplicate.filter'
import { UserInterceptor } from '../user.interceptor'
import { ActivityInterceptor } from '../activity.interceptor'
import { Request } from 'express'

@Controller('api/announcement')
@UsePipes(new ValidationPipe())
@UseGuards(AuthGuard)
@UseFilters(new DuplicateFilter())
@UseInterceptors(UserInterceptor)
@UseInterceptors(ActivityInterceptor)
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post('create')
  async create(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @Req() req: Request,
  ) {
    return await this.announcementService.create(
      createAnnouncementDto,
      <string>req.headers.user,
    )
  }
}
