import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Mutation, Int } from '@nestjs/graphql';

import { TokenDTO } from "../dto/token.dto";
import { AuthService } from "../auth.service";
import { AuthInput } from '../input/auth.input';
import { GqlAuthGuard } from '../guard/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Mutation(() => TokenDTO)
  async jwtLogin (@Args('auth') auth: AuthInput) {
    return await this.authService.login(auth)
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout (@Args('userId', { type: () => Int }) userId: number) {
    return await this.authService.logout(userId)
  }

  @Mutation(() => TokenDTO)
  // @UseGuards(GqlAuthGuard)
  async refreshTokens (
    @Args('userId') userId: string,
    @Args('refreshToken') refreshToken: string
  ) {
    return await this.authService.refreshTokens(userId, refreshToken)
  }
}
