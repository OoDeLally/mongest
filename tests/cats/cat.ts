import { ObjectId } from 'mongodb';
import mongoose, { Schema } from 'mongoose';
import { BuildMongestService } from 'src/BuildMongestService';

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
  },
  { discriminatorKey: 'kind' },
);

export const CatModel = mongoose.model(Cat.name, CatSchema);

export class CatsService extends BuildMongestService(Cat) {
  async findByName(name: string): Promise<Cat | null> {
    const doc = await this.findOne({ name });
    return doc;
  }
}
