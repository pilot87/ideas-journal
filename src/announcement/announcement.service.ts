import { Injectable } from '@nestjs/common'
import { CreateAnnouncementDto } from './dto/create-announcement.dto'
import { Announcement } from './entities/announcement.entity'
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class AnnouncementService {
  async create(createAnnouncementDto: CreateAnnouncementDto, author: string) {
    await Announcement.create(createAnnouncementDto, author)
    return { message: 'Announcement created' }
  }

  async list(idea: string) {
    const announcements = await Announcement.list(idea)
    const ideac = await Announcement.listc(idea)
    const ideat = await Announcement.listt(idea)

    return {
      message: 'List',
      list: announcements.map((a) => ({
        ...a,
        comments: ideac
          .filter((c) => c.anname === a.anname)
          .map((c) => ({ text: c.commenttext, author: c.username })),
        tags: ideat.filter((t) => t.anname === a.anname).map((t) => t.tagname),
      })),
    }
  }

  async createcomment(createCommentDto: CreateCommentDto, author: string) {
    await Announcement.createcomment(createCommentDto, author)
    return { message: 'Comment created' }
  }
}
