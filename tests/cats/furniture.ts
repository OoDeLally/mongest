import { Schema } from 'mongoose';
import { BuildMongestService } from 'src/BuildMongestService';
import { Item, ItemKind, ItemModel } from './item';

export class Furniture extends Item {
  dimensions!: string;
}

export const FurnitureSchema = new Schema(
  {
    dimensions: { type: String },
  },
  { discriminatorKey: 'kind' },
);

export const FurnitureModel = ItemModel.discriminator(ItemKind.Furniture, FurnitureSchema);

export class FurnituresService extends BuildMongestService(Furniture, FurnitureSchema) {}
