import { CreateAnnouncementDto } from '../dto/create-announcement.dto'
import { db } from '../../main'
import { DuplicateException } from '../../duplicate.filter'
import { CreateCommentDto } from '../dto/create-comment.dto'

export class Announcement {
  static async create(
    createAnnouncementDto: CreateAnnouncementDto,
    author: string,
  ) {
    await db
      .any(
        'INSERT INTO announcement (ideaname, username, anname, short_desc, text) VALUES' +
          '(${ideaname}, ${username}, ${anname}, ${short_desc}, ${text});',
        {
          ideaname: createAnnouncementDto.ideaname,
          username: author,
          anname: createAnnouncementDto.anname,
          short_desc: createAnnouncementDto.short_desc,
          text: createAnnouncementDto.text,
        },
      )
      .catch((e) => {
        throw new DuplicateException(e['detail'])
      })
    for (const tag of createAnnouncementDto.tags) {
      await db.any(
        'INSERT INTO tags (tagname) VALUES (${tagname}) ON CONFLICT DO NOTHING;',
        { tagname: tag },
      )
      await db.any(
        'INSERT INTO antags (anname, tagname) VALUES (${anname}, ${tagname}) ON ' +
          'CONFLICT DO NOTHING;',
        { anname: createAnnouncementDto.anname, tagname: tag },
      )
    }
    return true
  }

  static async listc(idea: string) {
    return await db.any(
      'SELECT anname, commenttext, c.username FROM announcement a JOIN ancomments ' +
        'c USING (anname) WHERE ideaname = ${ideaname};',
      { ideaname: idea },
    )
  }

  static async listt(idea: string) {
    return await db.any(
      'SELECT anname, tagname FROM announcement NATURAL JOIN antags ' +
        'WHERE ideaname = ${ideaname};',
      { ideaname: idea },
    )
  }

  static async list(idea: string) {
    return await db.any(
      'SELECT * FROM announcement WHERE ideaname = ${ideaname};',
      { ideaname: idea },
    )
  }

  static async createcomment(
    createCommentDto: CreateCommentDto,
    author: string,
  ) {
    return await db
      .any(
        'INSERT INTO ancomments (anname, commenttext, username) VALUES ' +
          '(${anname}, ${commenttext}, ${username});',
        {
          anname: createCommentDto.anname,
          commenttext: createCommentDto.text,
          username: author,
        },
      )
      .catch((e) => {
        throw new DuplicateException(e['detail'])
      })
  }
}
