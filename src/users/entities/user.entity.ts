import { Document } from 'mongoose';
import { ObjectType, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FilterableField, IDField } from '@nestjs-query/query-graphql';

@ObjectType()
@Schema({
  id: true,
  collection: 'users',
  timestamps: { createdAt: 'created', updatedAt: 'updated' }
})
export class User extends Document {
  @IDField(() => ID)
  @FilterableField()
  id: string;

  @Prop()
  @FilterableField({ nullable: true })
  name: string;

  @Prop()
  @FilterableField({ nullable: true })
  username: string;

  @Prop()
  @FilterableField()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: true })
  @FilterableField()
  isActive: boolean;

  @Prop()
  @FilterableField()
  userStatus: string

  @Prop()
  hashedRt: string

  @Prop()
  @FilterableField()
  loggedInAt: Date

  @Prop()
  @FilterableField()
  loggedOutAt: Date

  @Prop()
  @FilterableField()
  tokenRefreshedAt: Date

  @Prop({ default: Date.now })
  @FilterableField()
  created: Date;

  @Prop({ default: Date.now })
  @FilterableField()
  updated: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);