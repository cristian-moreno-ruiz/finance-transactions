import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Logger } from 'src/infrastructure/logger';

/**
 * Creates an instance of mongo memory server and connects to it.
 */
export async function mongoInit(): Promise<void> {
	let mongo;
	try {
		mongo = await MongoMemoryServer.create();
		const uri = mongo.getUri();
		await mongoose.connect(uri, {});
		Logger.log('Connected to MongoDB: ', uri);
	} catch (error) {
		Logger.error('Error connecting to MongoDB', error);
		await mongo?.stop();
		process.exit(1);
	}
}
