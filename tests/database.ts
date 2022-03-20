import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export let MongodInstance: MongoMemoryServer;

export const createTestDatabase = async (): Promise<void> => {
  MongodInstance = await MongoMemoryServer.create();
  const uri = MongodInstance.getUri('test');
  await mongoose.connect(uri);
};
