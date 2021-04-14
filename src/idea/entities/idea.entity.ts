import { CreateIdeaDto } from '../dto/create-idea.dto'
import { db } from '../../main'
import { DuplicateException } from '../../duplicate.filter'

export class Ideas {
  static async add(createIdeaDto: CreateIdeaDto, author: string) {
    await db
      .any(
        'INSERT INTO ideas (ideaname, username, describtion, short_desc, link)' +
          'VALUES (${ideaname}, ${username}, ${describtion}, ${short_desc}, ${link});',
        {
          ideaname: createIdeaDto.ideaname,
          username: author,
          describtion: createIdeaDto.describtion,
          short_desc: createIdeaDto.short_desc,
          link: createIdeaDto.link,
        },
      )
      .catch((e) => {
        throw new DuplicateException(e['detail'])
      })
    for (const tag of createIdeaDto.tags) {
      await db.any(
        'INSERT INTO tags (tagname) VALUES (${tagname}) ON CONFLICT DO NOTHING;',
        { tagname: tag },
      )
      await db.any(
        'INSERT INTO ideastags (ideaname, tagname) VALUES (${ideaname}, ${tagname}) ON CONFLICT DO NOTHING;',
        { ideaname: createIdeaDto.ideaname, tagname: tag },
      )
    }

    return true
  }
  static async listall() {
    return []
  }
}
