import { Schema } from 'mongoose';
import { BuildMongestService } from 'src/BuildMongestService';
import { Cat, CatKind, CatModel } from './cat';

export class HomeCat extends Cat {
  humanSlave!: string;
}

export const HomeCatSchema = new Schema(
  {
    humanSlave: String,
  },
  { discriminatorKey: 'kind' },
);

export const HomeCatModel = CatModel.discriminator(CatKind.HomeCat, HomeCatSchema);

export class HomeCatsService extends BuildMongestService(HomeCat, HomeCatSchema) {}
