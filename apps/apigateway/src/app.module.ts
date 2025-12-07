import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [UsersModule, MessagingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
