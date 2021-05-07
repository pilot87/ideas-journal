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

  // return all ideas
  static async list() {
    return await db.any(
      'SELECT ideaname, username author, short_desc, status FROM ' +
        'ideas ORDER BY author, ideaname',
    )
  }

  // return tags (tags table used for future columns)
  static async listt() {
    return await db.any(
      'SELECT ideaname, tagname FROM ideas NATURAL JOIN ideastags NATURAL JOIN tags',
    )
  }

  static async listbyuser(name: string) {
    return await db.any(
      'SELECT ideaname i, username author, short_desc, tagname, status FROM ideas ' +
        'NATURAL LEFT OUTER JOIN ideastags NATURAL JOIN tags WHERE username = ${username} ' +
        'ORDER BY author, i;',
      { username: name },
    )
  }

  static async getByName(ideaname: string) {
    return await db.any(
      'SELECT ideaname, username author, short_desc, tagname tags, describtion, "link", status FROM ' +
        'ideas NATURAL LEFT OUTER JOIN ideastags NATURAL LEFT JOIN tags WHERE ideaname = ${ideaname} ' +
        'ORDER BY ideaname;',
      { ideaname: ideaname },
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
        ideaname: createCommentDto.ideaname,
        commenttext: createCommentDto.text,
        username: author,
      },
    )
  }
}
