import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BuildMongestService } from '../../src/BuildMongestService';
import { StrayCat } from './stray-cat.entity';

class StrayCatsService extends BuildMongestService(StrayCat) {}

@Injectable()
export class StrayCatsNestService extends StrayCatsService {
  constructor(@InjectModel(StrayCat.name) model: Model<StrayCat>) {
    super(model);
  }
}
