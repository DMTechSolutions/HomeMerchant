import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Model,
  FilterQuery,
  QueryOptions,
  Callback,
  UpdateQuery,
  UpdateWithAggregationPipeline
} from 'mongoose';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userService: Model<User>
  ) { }

  async findOne (
    filter?: FilterQuery<any>,
    projection?: any | null,
    options?: QueryOptions | null,
    callback?: Callback<any | null>
  ) {
    return this.userService.findOne(filter, projection, options, callback)
  }

  async findById (
    id: any,
    projection?: any | null,
    options?: QueryOptions | null,
    callback?: Callback<any | null>
  ) {
    return this.userService.findById(id, projection, options, callback)
  }

  async update (
    filter?: FilterQuery<any>,
    update?: UpdateQuery<any> | UpdateWithAggregationPipeline,
    options?: QueryOptions | null,
    callback?: Callback
  ): Promise<any> {
    return this.userService.updateOne(filter, update, options, callback)
  }
}
