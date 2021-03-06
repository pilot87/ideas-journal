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
import { NegativeFilter } from '../negative.filter'

@Controller('api/announcement')
@UsePipes(new ValidationPipe())
@UseFilters(new DuplicateFilter())
@UseFilters(new NegativeFilter())
@UseInterceptors(UserInterceptor)
@UseInterceptors(ActivityInterceptor)
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post('create')
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  async createcomment(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    return await this.announcementService.createcomment(
      createCommentDto,
      <string>req.headers.user,
    )
  }

  @Get('getbyid/:id')
  async getbyID(@Param('id') id: string) {
    return await this.announcementService.getbyID(id)
  }

  @Post('choose')
  @UseGuards(AuthGuard)
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
