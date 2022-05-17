import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';


@ObjectType()
export class TokenObjectType {
  @Field()
  expiresIn: string;

  @Field()
  token: string;
}

@ObjectType()
export class JWTAuthResponse {
  @Field(() => TokenObjectType)
  accessToken: TokenObjectType;

  @Field(() => TokenObjectType)
  refreshToken: TokenObjectType;

  @Field()
  user: User;
}


@ObjectType()
export class TokenDTO {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  user: User;
}

@ObjectType()
export class Tokens {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
