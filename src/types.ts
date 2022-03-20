/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { ObjectId } from 'mongodb';

// Do NOT use EntityPayload = Record<string, unknown>.
// Even if in practice it is not the case TS considers that classes can be indexed by non-string keys.
export type EntityPayload = object;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AbstractType<T = any> = abstract new (...args: any[]) => T;

export type ExtractIdType<EDoc extends EntityPayload> = '_id' extends keyof EDoc
  ? EDoc['_id']
  : ObjectId;

export type OmitId<T> = Omit<T, '_id'>;

export class NotFoundException extends Error {}

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}
