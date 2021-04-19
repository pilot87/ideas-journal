import { Injectable } from '@nestjs/common'
import { CreateAnnouncementDto } from './dto/create-announcement.dto'
import { Announcement } from './entities/announcement.entity'
import { CreateCommentDto } from './dto/create-comment.dto'
import { ChooseAnnouncementDto } from './dto/choose-announcement.dto'
import { Ideas } from '../idea/entities/idea.entity'

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

  async getbyname(anname: string) {
    const an = await Announcement.getbyname(anname)
    return {
      message: 'Announcement',
      an: {
        ...an,
        comments: (await Announcement.listanc(anname)).map(
          (c) => c.commenttext,
        ),
        tags: (await Announcement.listant(anname)).map((t) => t.tagname),
      },
    }
  }

  async choose(chooseAnnouncementDto: ChooseAnnouncementDto, author: string) {
    const idea = (await Ideas.getByName(chooseAnnouncementDto.ideaname))[0]
    if (idea === undefined) {
      return { message: 'No idea' }
    }
    if (idea.author !== author) {
      return { message: 'Permission denied' }
    }
    if (!(await Announcement.getbyname(chooseAnnouncementDto.anname))) {
      return { message: 'No announcement' }
    }
    if (
      (await Announcement.list(chooseAnnouncementDto.ideaname)).find(
        (a) => a.status === 'chosen',
      )
    ) {
      return { message: 'Another announcement already chosen' }
    }
    await Announcement.choose(chooseAnnouncementDto)
    return { message: 'Announcement choosed' }
  }
}
