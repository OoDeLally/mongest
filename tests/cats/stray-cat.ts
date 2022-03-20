import { Schema } from 'mongoose';
import { BuildMongestService } from 'src/BuildMongestService';
import { registerEntityClassForSchema } from '../../src/registerEntityClassForSchema';
import { Cat, CatModel } from './cat';

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

registerEntityClassForSchema(StrayCat, StrayCatSchema);

export const StrayCatModel = CatModel.discriminator(StrayCat.name, StrayCatSchema);

export class StrayCatsService extends BuildMongestService(StrayCat) {}
