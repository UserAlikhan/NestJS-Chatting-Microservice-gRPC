import { Controller, Get } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { Observable } from 'rxjs';
import { ChatStreamRequest, ChatStreamResponse, Empty, MessagingServiceController, MessagingServiceControllerMethods, SendMessageRequest } from '@app/common/types/messaging';

@Controller()
@MessagingServiceControllerMethods()
export class MessagingController implements MessagingServiceController {
  constructor(private readonly messagingService: MessagingService) {}

  sendMessage(request: SendMessageRequest): Promise<Empty> | Observable<Empty> | Empty {
    if (!request.roomId || !request.message) {
      throw new Error("Empty message.");
    }

    return this.messagingService.sendMessage(request.roomId, request.message);
  }
  chatStream(request: Observable<ChatStreamRequest>): Observable<ChatStreamResponse> {
    return this.messagingService.chatStream(request);
  }
}
