import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto, PaginationDto, UpdateUserDto, User, Users, USERS_SERVICE_NAME, UsersServiceClient } from '@app/common';
import { AUTH_SERVICE } from './constants';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class UsersService implements OnModuleInit {
  private usersService: UsersServiceClient;

  constructor(@Inject(AUTH_SERVICE) private client: ClientGrpcProxy) {}
  
  onModuleInit() {
    this.usersService = this.client.getService<UsersServiceClient>(
      USERS_SERVICE_NAME
    );
  }

  create(createUserDto: CreateUserDto): Observable<User> {
    return this.usersService.createUser(createUserDto);
  }

  findAll(): Observable<Users> {
    return this.usersService.findAllUsers({});
  }

  findOne(id: string): Observable<User> {
    return this.usersService.findOneUser({ id })
  }

  update(updateUserDto: UpdateUserDto): Observable<User> {
    return this.usersService.updateUser(updateUserDto);
  }

  remove(id: string): Observable<User> {
    return this.usersService.removeUser({ id });
  }

  emailUsers() {
    const users = new ReplaySubject<PaginationDto>();

    users.next({ page: 0, skip: 25 });
    users.next({ page: 1, skip: 25 });
    users.next({ page: 2, skip: 25 });
    users.next({ page: 3, skip: 25 });

    users.complete();

    let chunkNumber = 1;

    this.usersService.queryUsers(users).subscribe(users => {
      console.log('Chunk', chunkNumber, users);
      chunkNumber++;
    });
  }
}
