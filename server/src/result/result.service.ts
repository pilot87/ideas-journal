import { Injectable } from '@nestjs/common'
import { CreateResultDto } from './dto/create-result.dto'
import { Result } from './entities/result.entity'
import { Ideas } from '../idea/entities/idea.entity'
import { NegativeException } from '../negative.filter'

@Injectable()
export class ResultService {
  async create(createResultDto: CreateResultDto, author: string) {
    const idea = (await Ideas.getByName(createResultDto.ideaname))[0]
    if (idea === undefined) {
      throw new NegativeException({ message: 'No idea' })
    }
    if (idea.author !== author) {
      throw new NegativeException({ message: 'Permission denied' })
    }
    if (idea.status === 'new') {
      throw new NegativeException({ message: 'No announcement chosen' })
    }
    if (idea.status === 'complete') {
      throw new NegativeException({ message: 'Idea already completed' })
    }
    await Result.create(createResultDto)
    return { message: 'Result created' }
  }
}
