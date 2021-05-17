import { db } from '../../main'
import { CreateResultDto } from '../dto/create-result.dto'
import { DuplicateException } from '../../duplicate.filter'

export class Result {
  static async create(createResultDto: CreateResultDto) {
    return await db
      .any(
        "UPDATE ideas SET status = 'complete' WHERE ideaname = ${ideaname};" +
          "UPDATE announcement SET status = 'complete' WHERE anname = ${anname};" +
          'INSERT INTO results (comment, ideaname, anname) VALUES ' +
          '(${comment}, ${ideaname}, ${anname});',
        {
          ideaname: createResultDto.ideaname,
          anname: createResultDto.anname,
          comment: createResultDto.comment,
        },
      )
      .catch((e) => {
        throw new DuplicateException(e['detail'])
      })
  }

  static async getbyname(name: string) {
    console.log('ideaname: ', name)
    return (
      await db.any('SELECT comment FROM results WHERE ideaname=${ideaname};', {
        ideaname: name,
      })
    )[0].comment
  }
}
