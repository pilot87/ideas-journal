import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { IdeaModule } from './idea/idea.module'
import { AnnouncementModule } from './announcement/announcement.module'
import { ResultModule } from './result/result.module'

@Module({
  imports: [AuthModule, IdeaModule, AnnouncementModule, ResultModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
