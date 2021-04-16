import { CreateAnnouncementDto } from '../dto/create-announcement.dto'
import { db } from '../../main'
import { DuplicateException } from '../../duplicate.filter'

export class Announcement {
  static async create(
    createAnnouncementDto: CreateAnnouncementDto,
    author: string,
  ) {
    await db
      .any(
        'INSERT INTO announcement (ideaname, username, anname, text) VALUES' +
          '(${ideaname}, ${username}, ${anname}, ${text});',
        {
          ideaname: createAnnouncementDto.ideaname,
          username: author,
          anname: createAnnouncementDto.anname,
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
        'INSERT INTO antags (anname, tagname) VALUES (${anname}, ${tagname}) ON CONFLICT DO NOTHING;',
        { anname: createAnnouncementDto.anname, tagname: tag },
      )
    }

    return true
  }
}
