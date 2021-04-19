import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  UseFilters,
  UseInterceptors,
  Req,
  Param,
} from '@nestjs/common'
import { AnnouncementService } from './announcement.service'
import { CreateAnnouncementDto } from './dto/create-announcement.dto'
import { AuthGuard } from '../auth.guard'
import { DuplicateFilter } from '../duplicate.filter'
import { UserInterceptor } from '../user.interceptor'
import { ActivityInterceptor } from '../activity.interceptor'
import { Request } from 'express'
import { ChooseAnnouncementDto } from './dto/choose-announcement.dto'
import { CreateCommentDto } from './dto/create-comment.dto'

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
  @Get('list/:idea')
  async list(@Param('idea') idea: string) {
    return await this.announcementService.list(idea)
  }

  @Post('createcomment')
  async createcomment(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    return await this.announcementService.createcomment(
      createCommentDto,
      <string>req.headers.user,
    )
  }

  @Get('getbyname/:anname')
  async getbyname(@Param('anname') anname: string) {
    return await this.announcementService.getbyname(anname)
  }

  @Post('choose')
  async choose(
    @Body() chooseAnnouncementDto: ChooseAnnouncementDto,
    @Req() req: Request,
  ) {
    return await this.announcementService.choose(
      chooseAnnouncementDto,
      <string>req.headers.user,
    )
  }
}
