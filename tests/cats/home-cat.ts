import { Schema } from 'mongoose';
import { BuildMongestService } from 'src/BuildMongestService';
import { registerEntityClassForSchema } from '../../src/registerEntityClassForSchema';
import { Cat, CatModel } from './cat';

export class HomeCat extends Cat {
  humanSlave!: string;
}

export const HomeCatSchema = new Schema(
  {
    humanSlave: String,
  },
  { discriminatorKey: 'kind' },
);

registerEntityClassForSchema(HomeCat, HomeCatSchema);

export const HomeCatModel = CatModel.discriminator(HomeCat.name, HomeCatSchema);

export class HomeCatsService extends BuildMongestService(HomeCat) {}
