import { ObjectId } from 'mongodb';
import mongoose, { Schema } from 'mongoose';
import { BuildMongestService } from 'src/BuildMongestService';

export enum ItemKind {
  Furniture = 'Furniture',
}
export class Item {
  _id!: ObjectId;
  kind!: ItemKind;
  name!: string;
}

export const ItemSchema = new Schema(
  {
    kind: { type: String, enum: ItemKind },
    name: String,
  },
  { discriminatorKey: 'kind' },
);

export const ItemModel = mongoose.model(Item.name, ItemSchema);

export class ItemsService extends BuildMongestService(Item, ItemSchema) {}
