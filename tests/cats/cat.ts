import { ObjectId } from 'mongodb';
import mongoose, { Schema } from 'mongoose';
import { BuildMongestService } from 'src/BuildMongestService';
import { ItemModel } from './item';

export enum CatKind {
  StrayCat = 'StrayCat',
  HomeCat = 'HomeCat',
}

export class Cat {
  _id!: ObjectId;
  kind!: CatKind;
  name!: string;
  age!: number;
  stripeColor?: 'black' | 'grey' | 'brown';
  color?: string;
}

export const CatSchema = new Schema(
  {
    kind: { type: String, enum: CatKind },
    name: String,
    age: Number,
    stripeColor: { type: String, required: false },
    color: { type: String, required: false, default: 'black' },
    toys: [{ type: Schema.Types.ObjectId, ref: ItemModel }], // non-id field name format
    scratchingItemsId: [{ type: Schema.Types.ObjectId, ref: ItemModel }], // "fieldId" name format
    favoriteToy: { type: Schema.Types.ObjectId, ref: ItemModel },
  },
  { discriminatorKey: 'kind' },
);

export const CatModel = mongoose.model(Cat.name, CatSchema);

export class CatsService extends BuildMongestService(Cat, CatSchema) {
  async findByName(name: string): Promise<Cat | null> {
    const doc = await this.findOne({ name });
    return doc;
  }
}
