import { Injectable } from '@nestjs/common'
import { CreateResultDto } from './dto/create-result.dto'
import { Result } from './entities/result.entity'
import { Ideas } from '../idea/entities/idea.entity'

@Injectable()
export class ResultService {
  async create(createResultDto: CreateResultDto, author: string) {
    const idea = (await Ideas.getByName(createResultDto.ideaname))[0]
    if (idea === undefined) {
      return { message: 'No idea' }
    }
    if (idea.author !== author) {
      return { message: 'Permission denied' }
    }
    if (idea.status === 'new') {
      return { message: 'No announcement chosen' }
    }
    if (idea.status === 'complete') {
      return { message: 'Idea already completed' }
    }
    await Result.create(createResultDto)
    return { message: 'Result created' }
  }
}
