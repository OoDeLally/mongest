import { Schema } from 'mongoose';
import { BuildMongestService } from 'src/BuildMongestService';
import { Cat, CatKind, CatModel } from './cat';

export class StrayCat extends Cat {
  territorySize!: number;
  enemyCount?: number;
}

export const StrayCatSchema = new Schema(
  {
    territorySize: Number,
    enemyCount: { type: Number, required: false },
  },
  { discriminatorKey: 'kind' },
);

export const StrayCatModel = CatModel.discriminator(CatKind.StrayCat, StrayCatSchema);

export class StrayCatsService extends BuildMongestService(StrayCat, StrayCatSchema) {}
