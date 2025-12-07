import { Controller, Get, Post, Body, Sse, Query } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { Observable } from 'rxjs';
import { Empty } from '@app/common';
import { map } from 'rxjs/operators';
import type { ChatStreamResponse, Message } from '@app/common/types/messaging';

@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post()
  sendMessage(@Query("roomId") roomId: string, @Body() message: Message): Observable<Empty> {
    return this.messagingService.sendMessage(roomId, message);
  }

  @Sse('stream')
  streamMessages(@Query("roomId") roomId: string): Observable<{ data: Message | undefined }> {
    return this.messagingService.chatStream(roomId).pipe(
      map((resp: ChatStreamResponse) => ({ data: resp.message }))
    );
  }
}
