import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { IdeaModule } from './idea/idea.module'
import { AnnouncementModule } from './announcement/announcement.module'
import { ResultModule } from './result/result.module'
import { ProfileModule } from './profile/profile.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

@Module({
  imports: [
    AuthModule,
    IdeaModule,
    AnnouncementModule,
    ResultModule,
    ProfileModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', '..', 'client', 'build'),
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
