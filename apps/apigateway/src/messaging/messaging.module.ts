import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingController } from './messaging.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { MESSAGING_SERVICE } from './constants';
import { MESSAGING_PACKAGE_NAME } from '@app/common/types/messaging';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MESSAGING_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: MESSAGING_PACKAGE_NAME,
          protoPath: join(__dirname, '../messaging.proto'),
          url: "localhost:5001",
        }
      }
    ])
  ],  
  controllers: [MessagingController],
  providers: [MessagingService],
})
export class MessagingModule {}
