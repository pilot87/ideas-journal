import {
  Controller,
  Post,
  Body,
  Req,
  UsePipes,
  ValidationPipe,
  UseGuards,
  UseFilters,
  UseInterceptors, Get, Param,
} from '@nestjs/common'
import { ResultService } from './result.service'
import { CreateResultDto } from './dto/create-result.dto'
import { Request } from 'express'
import { AuthGuard } from '../auth.guard'
import { DuplicateFilter } from '../duplicate.filter'
import { UserInterceptor } from '../user.interceptor'
import { ActivityInterceptor } from '../activity.interceptor'
import { NegativeFilter } from '../negative.filter'

@Controller('api/result')
@UsePipes(new ValidationPipe())
@UseFilters(new DuplicateFilter())
@UseFilters(new NegativeFilter())
@UseInterceptors(UserInterceptor)
@UseInterceptors(ActivityInterceptor)
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async create(@Body() createResultDto: CreateResultDto, @Req() req: Request) {
    return await this.resultService.create(
      createResultDto,
      <string>req.headers.user,
    )
  }

  @Get('getbyname/:name')
  async getbyname(@Param('name') name: string) {
    return await this.resultService.getbyname(name)
  }
}
