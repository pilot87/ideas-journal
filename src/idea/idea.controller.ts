import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req, UsePipes, ValidationPipe, UseInterceptors, UseGuards, UseFilters,
} from '@nestjs/common';
import { Request } from 'express'
import { IdeaService } from './idea.service'
import { CreateIdeaDto } from './dto/create-idea.dto'
import { UpdateIdeaDto } from './dto/update-idea.dto'
import { UserInterceptor } from '../user.interceptor'
import { AuthGuard } from '../auth.guard'
import { DuplicateFilter } from '../duplicate.filter'

@Controller('api/idea')
@UsePipes(new ValidationPipe())
@UseGuards(AuthGuard)
@UseFilters(new DuplicateFilter())
@UseInterceptors(UserInterceptor)
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Post('create')
  create(@Body() createIdeaDto: CreateIdeaDto, @Req() req: Request) {
    return this.ideaService.create(createIdeaDto, <string>req.headers.user)
  }

  @Get('listall')
  listall() {
    return this.ideaService.listall()
  }
}
