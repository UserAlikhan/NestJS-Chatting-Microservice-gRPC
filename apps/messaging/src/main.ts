import { NestFactory } from '@nestjs/core';
import { MessagingModule } from './messaging.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { MESSAGING_PACKAGE_NAME } from '@app/common/types/messaging';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MessagingModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../messaging.proto'),
        package: MESSAGING_PACKAGE_NAME,
        url: "localhost:5001",
      }
    }
  );

  await app.listen();
}
bootstrap();
