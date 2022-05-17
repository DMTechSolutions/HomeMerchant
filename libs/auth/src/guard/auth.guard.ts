import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * @method canActivate
   * @param { ExecutionContext } context
   * @returns { Boolean }
   */
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext();
    const { headers } = ctx.req

    if (!headers.authorization) {
      return false;
    }
    this.validateToken(headers.authorization);
    return true;
  }

  /**
   * @method validateToken
   * @param { String } auth
   * @returns { Exception | }
   */
  async validateToken(auth: string) {
    if (auth?.split(' ')?.[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const token = auth?.split(' ')?.[1];
    try {
      return jwt.verify(token, process.env.SECRET);
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}