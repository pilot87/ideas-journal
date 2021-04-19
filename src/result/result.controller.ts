import {
  Controller,
  Post,
  Body,
  Req,
  UsePipes,
  ValidationPipe,
  UseGuards,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common'
import { ResultService } from './result.service'
import { CreateResultDto } from './dto/create-result.dto'
import { Request } from 'express'
import { AuthGuard } from '../auth.guard'
import { DuplicateFilter } from '../duplicate.filter'
import { UserInterceptor } from '../user.interceptor'
import { ActivityInterceptor } from '../activity.interceptor'

@Controller('api/result')
@UsePipes(new ValidationPipe())
@UseGuards(AuthGuard)
@UseFilters(new DuplicateFilter())
@UseInterceptors(UserInterceptor)
@UseInterceptors(ActivityInterceptor)
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post('create')
  async create(@Body() createResultDto: CreateResultDto, @Req() req: Request) {
    return await this.resultService.create(
      createResultDto,
      <string>req.headers.user,
    )
  }
}
