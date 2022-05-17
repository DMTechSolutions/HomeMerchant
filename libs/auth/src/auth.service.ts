import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';

import _ from 'src/lodash';
import { AuthInput } from './input/auth.input';
import { TokenDTO, Tokens } from './dto/token.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async login (auth: AuthInput): Promise<TokenDTO> {
    // NOTE find user in db
    const user: any = await this.userService.findOne({ email: auth.email, isActive: true })

    if (!user) {
      const userData = await this.userService.findOne(
        { email: auth.email },
        'isActive'
      )

      if (userData && userData?.isActive !== true) {
        throw new HttpException(
          { error: 'This account is not active anymore. Please contact admin.!', status: HttpStatus.NOT_FOUND },
          HttpStatus.FORBIDDEN
        )
      }
    }

    const verifyPassword = _.isEmpty(user)
      ? null
      : await bcrypt.compare(auth.password, user.password)

    // NOTE If user not exist of password is not match throw back with error message
    if (!user || !verifyPassword) {
      throw new HttpException({
        error: 'Username or password is incorrect.!',
        status: HttpStatus.NOT_FOUND
      }, HttpStatus.FORBIDDEN)
    }

    const { id, email, username } = user
    // NOTE generate and sign token
    const { accessToken, refreshToken }: Tokens = await this.getTokens(id, email, username);
    await this.updateRtHash(
      user.id,
      refreshToken,
      { userStatus: 'online', loggedInAt: new Date }
    );

    return { accessToken, refreshToken, user }
  }

  async logout (id: number): Promise<boolean> {
    await this.userService.update(
      { id, hashedRt: { $not: null } },
      { hashedRt: null, loggedOutAt: new Date, userStatus: 'offline' }
    );

    return true
  }

  async refreshTokens (userId: string, rt: string): Promise<TokenDTO> {
    const user: any = await this.userService.findById(userId)

    if (!user || !user.hashedRt) {
      throw new ForbiddenException('Access Denied')
    }

    const { id, email, hashedRt, username } = user
    const rtMatches = await bcrypt.compare(rt, hashedRt)

    if (!rtMatches) throw new ForbiddenException('Access Denied')

    const tokens = await this.getTokens(id, email, username)
    await this.updateRtHash(
      user.id,
      tokens.refreshToken,
      { tokenRefreshedAt: new Date }
    )

    return { ...tokens, user }
  }

  async getTokens (userId: number, email: string, username: string): Promise<Tokens> {
    const jwtPayload: string | Buffer | object = {
      sub: userId,
      email: email,
      username
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.SECRET,
        expiresIn: process.env.EXPIRE_ACCESS_TOKEN,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.SECRET2,
        expiresIn: process.env.EXPIRE_REFRESH_ACCESS_TOKEN,
      })
    ]);

    return { accessToken, refreshToken }
  }

  async updateRtHash (
    id: number,
    rt: string,
    additionalDataForUpdate: any = {}
  ): Promise<void> {
    const hashedRt = await bcrypt.hash(rt, 10);
    await this.userService.update({ _id: id }, { hashedRt, ...additionalDataForUpdate })
  }

  async validateUser (auth: AuthInput): Promise<User> {
    const user: any = this.userService.findOne({ email: auth.email })

    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED)
    }

    return user;
  }
}