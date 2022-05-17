import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AuthModule } from '@app/auth';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      // connectionName: 'mongoConnection',
      useFactory: () => {
        const {
          DATABASE_DRIVER,
          DATABASE_HOST,
          DATABASE_PORT,
          DATABASE_USER,
          DATABASE_PASSWORD,
          DATABASE_NAME
        } = process.env

        return {
          uri: `${DATABASE_DRIVER}://${DATABASE_HOST}:${DATABASE_PORT}`,
          autoIndex: true,
          autoCreate: true,
          user: DATABASE_USER,
          dbName: DATABASE_NAME,
          pass: DATABASE_PASSWORD,
          connectTimeoutMS: 30000
        }
      }
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      autoSchemaFile: 'schema.gql'
    }),
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
