import { CreateIdeaDto } from '../dto/create-idea.dto'
import { db } from '../../main'
import { DuplicateException } from '../../duplicate.filter'
import { CreateCommentDto } from '../dto/create-comment.dto'

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
    return await db.any(
      'SELECT ideaname i, username author, short_desc, tagname FROM ideas ' +
        'NATURAL LEFT OUTER JOIN ideastags NATURAL JOIN tags ORDER BY author, i;',
    )
  }

  static async listbyuser(name: string) {
    return await db.any(
      'SELECT ideaname i, username author, short_desc, tagname FROM ideas ' +
        'NATURAL LEFT OUTER JOIN ideastags NATURAL JOIN tags WHERE username = ${username} ' +
        'ORDER BY author, i;',
      { username: name },
    )
  }

  static async getByName(idea: string) {
    return await db.any(
      'SELECT ideaname i, username author, short_desc, tagname, describtion, "link" FROM ' +
        'ideas NATURAL LEFT OUTER JOIN ideastags NATURAL JOIN tags WHERE ideaname = ${idea} ' +
        'ORDER BY i;',
      { idea: idea },
    )
  }
  static async getIdeaComments(idea: string) {
    return await db.any(
      'SELECT * FROM ' +
        'ideas LEFT OUTER JOIN comments USING (ideaname) WHERE ideaname = ${idea};',
      { idea: idea },
    )
  }

  static async newComment(createCommentDto: CreateCommentDto, author: string) {
    return await db.any(
      'INSERT INTO comments (ideaname, commenttext, username) VALUES ' +
        '(${ideaname}, ${commenttext}, ${username});',
      {
        ideaname: createCommentDto.idea,
        commenttext: createCommentDto.text,
        username: author,
      },
    )
  }
}
