import { Injectable } from '@nestjs/common'
import { CreateIdeaDto } from './dto/create-idea.dto'
import { Ideas } from './entities/idea.entity'

@Injectable()
export class IdeaService {
  async create(createIdeaDto: CreateIdeaDto, author: string) {
    createIdeaDto.tags = createIdeaDto.tags.filter(
      (v, i, a) => a.indexOf(v) === i,
    )
    await Ideas.add(createIdeaDto, author)
    return { message: 'Idea created' }
  }

  async listall() {
    return Ideas.listall()
  }
}
