import * as bcrypt from 'bcrypt';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';

import _ from 'src/lodash'

@Injectable()
export class EncryptPasswordInterceptor implements NestInterceptor {
  async intercept (context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context).getArgs();

    // NOTE @BeforeInsert() hook always returns the password field value so It had to be done in the interceptor
    if (ctx.input?.user) {
      if (!_.isEmpty(ctx.input.user?.password)) {
        ctx.input.user.password = await bcrypt.hash(ctx.input.user.password, 10);
      }
    }

    if (ctx.input?.update) {
      if (!_.isEmpty(ctx.input.update?.password)) {
        ctx.input.update.password = await bcrypt.hash(ctx.input.update.password, 10);
      }
    }

    return next.handle()
  }
}
