import { Empty } from '@app/common';
import { ChatStreamRequest, ChatStreamResponse, Message } from '@app/common/types/messaging';
import { Injectable } from '@nestjs/common';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class MessagingService {
  // storage for current active rooms
  private rooms: Map<string, ReplaySubject<Message>> = new Map();
  // messages storage for each room
  private messagesStorage: Map<string, Message[]> = new Map();

  // one-direction method for sending a new message
  sendMessage(roomId: string, message: Message): Empty {
    // create new a message storage for provided roomId if does not exist
    if (!this.messagesStorage.has(roomId)) {
      this.messagesStorage.set(roomId, []);
    }
    // store new message in the storage
    this.messagesStorage.get(roomId)?.push(message);

    // create new a room for provided roomId if does not exist
    if (!this.rooms.has(roomId)) {
      // get history messages
      const history = this.messagesStorage.get(roomId) || [];
      // load last 100 messages into Observable
      const subject = new ReplaySubject<Message>(100);
      // store history messages
      history.forEach(msg => subject.next(msg));
      // create a new room
      this.rooms.set(roomId, subject);
    }
    
    // store a newly written question
    this.rooms.get(roomId)?.next(message);
    return {};
  }


  // stream method to receive all sent into the room messages
  chatStream(request$: Observable<ChatStreamRequest>): Observable<ChatStreamResponse> {
    // this is a custom Observable. Anything we subscriber.next(...) inside this block
    // will be sent to the client over the stream
    return new Observable<ChatStreamResponse>(subscriber => {
      let roomId: string | null = null;

      // subscribe for the client's stream
      const sub = request$.subscribe({
        // fires everytime client sends a request. We care about first call
        // because user passes roomId
        next: (req: ChatStreamRequest) => {
          // return error if no roomId specified
          if (!req.roomId) {
            subscriber.error(new Error("roomId is required"));
            return;
          }

          if (!roomId) {
            roomId = req.roomId;

            // if there is no roomId in rooms storage
            // load rooms and create room in the storage
            if (!this.rooms.has(roomId)) {
              const history = this.messagesStorage.get(roomId) || [];
              const subject = new ReplaySubject<Message>(100);
              history.forEach(msg => subject.next(msg));
              this.rooms.set(roomId, subject);
            }

            // get messages from the specific room and sent then to the user
            this.rooms.get(roomId)?.subscribe(msg => subscriber.next({
              roomId: roomId || "",
              message: msg
            }));
          }
        },
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete(),
      });
      
      // when the client disconnects, unsubscribe from request$
      // to prevent memory leaks
      return () => sub.unsubscribe();
    });
  }
}