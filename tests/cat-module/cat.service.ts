import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BuildMongestService } from '../../src/BuildMongestService';
import { Cat } from './cat.entity';

class CatsService extends BuildMongestService(Cat) {
  async findByName(name: string): Promise<Cat | null> {
    const doc = await this.findOne({ name });
    return doc;
  }
}

@Injectable()
export class CatsNestService extends CatsService {
  constructor(@InjectModel(Cat.name) model: Model<Cat>) {
    super(model);
  }
}
