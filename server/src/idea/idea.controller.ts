import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UseGuards,
  UseFilters,
} from '@nestjs/common'
import { Request } from 'express'
import { IdeaService } from './idea.service'
import { CreateIdeaDto } from './dto/create-idea.dto'
import { UserInterceptor } from '../user.interceptor'
import { AuthGuard } from '../auth.guard'
import { DuplicateFilter } from '../duplicate.filter'
import { ActivityInterceptor } from '../activity.interceptor'
import { CreateCommentDto } from './dto/create-comment.dto'
import { NegativeFilter } from '../negative.filter'

@Controller('api/idea')
@UsePipes(new ValidationPipe())
@UseFilters(new DuplicateFilter())
@UseFilters(new NegativeFilter())
@UseInterceptors(UserInterceptor)
@UseInterceptors(ActivityInterceptor)
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async create(@Body() createIdeaDto: CreateIdeaDto, @Req() req: Request) {
    return await this.ideaService.create(
      createIdeaDto,
      <string>req.headers.user,
    )
  }

  @Get('listall')
  async listall() {
    return await this.ideaService.listall()
  }

  @Get('listbyuser/:name')
  async listbyuser(@Param('name') name: string) {
    return await this.ideaService.listbyuser(name)
  }

  @Get('getbyid/:id')
  async getByID(@Param('id') id: string) {
    return await this.ideaService.getByID(id)
  }

  @Post('newcomment')
  @UseGuards(AuthGuard)
  async newComment(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    await this.ideaService.newComment(
      createCommentDto,
      <string>req.headers.user,
    )
    return { message: 'Comment created' }
  }
}
