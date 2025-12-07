import { Empty } from '@app/common';
import { ChatStreamRequest, ChatStreamResponse, Message, MESSAGING_SERVICE_NAME, MessagingServiceClient } from '@app/common/types/messaging';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { Observable, ReplaySubject } from 'rxjs';
import { MESSAGING_SERVICE } from './constants';

@Injectable()
export class MessagingService implements OnModuleInit {
  private messagingService: MessagingServiceClient;

  constructor(@Inject(MESSAGING_SERVICE) private readonly client: ClientGrpcProxy) {}

  onModuleInit() {
    this.messagingService = this.client.getService<MessagingServiceClient>(
      MESSAGING_SERVICE_NAME
    );
  }

  sendMessage(roomId: string, message: Message): Observable<Empty> {
    return this.messagingService.sendMessage({roomId, message});
  }

  chatStream(roomId: string): Observable<ChatStreamResponse> {
    const request$ = new ReplaySubject<ChatStreamRequest>(1);
    request$.next({ roomId });
    request$.complete();

    return this.messagingService.chatStream(request$);
  }
}
