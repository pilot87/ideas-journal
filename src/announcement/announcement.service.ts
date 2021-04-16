import { Injectable } from '@nestjs/common'
import { CreateAnnouncementDto } from './dto/create-announcement.dto'
import { Announcement } from './entities/announcement.entity'

@Injectable()
export class AnnouncementService {
  async create(createAnnouncementDto: CreateAnnouncementDto, author: string) {
    await Announcement.create(createAnnouncementDto, author)
    return { message: 'Announcement created' }
  }
}
