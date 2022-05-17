import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryMongooseModule } from '@nestjs-query/query-mongoose';

import { UsersService } from './users.service';
import { User, UserSchema } from './entities/user.entity'
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlAuthGuard } from '@app/auth/guard/gql-auth.guard';
import { EncryptPasswordInterceptor } from './interceptor/password.interceptor';

const guards = [GqlAuthGuard]

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      // import the NestjsQueryMongooseModule to register the entity with mongoose
      // and provide a QueryService
      imports: [
        NestjsQueryMongooseModule.forFeature([
          { document: User, name: User.name, schema: UserSchema }
        ])
      ],
      // describe the resolvers you want to expose
      resolvers: [{
        DTOClass: User,
        EntityClass: User,
        CreateDTOClass: CreateUserInput,
        UpdateDTOClass: UpdateUserInput,
        enableTotalCount: true,
        create: {
         // guards,
          // pipes: [CreatedByPipe],
          interceptors: [EncryptPasswordInterceptor]
        },
        update: {
          guards,
          // pipes: [UpdatedByPipe],
          interceptors: [EncryptPasswordInterceptor]
        },
        delete: { guards },
        read: {
          guards,
          defaultResultSize: 10,
          maxResultsSize: 1000
        }
      }]
    })
  ],
  exports: [UsersService],
  providers: [UsersService]
})
export class UsersModule { }
