import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { AuthResolver } from './resolver/auth.resolver';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      session: false,
      property: 'users',
      defaultStrategy: 'jwt'
    }),
    JwtModule.registerAsync({
      useFactory () {
        return {
          secret: process.env.SECRET,
          signOptions: {
            expiresIn: process.env.EXPIRE_ACCESS_TOKEN
          }
        }
      }
    })
  ],
  providers: [
    AuthResolver,
    JwtStrategy,
    AuthService
  ],
})
export class AuthModule { }
