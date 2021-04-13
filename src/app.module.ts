import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { IdeaModule } from './idea/idea.module';

@Module({
  imports: [AuthModule, IdeaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
