import { MongoTransactionModel } from 'src/infrastructure/repositories';

export const execMock = jest.fn().mockResolvedValue([]);
export const leanMock = jest.fn().mockReturnThis();

export const createMockMongoTransactionModel = (): jest.Mocked<typeof MongoTransactionModel> => {
	MongoTransactionModel.find = jest.fn().mockReturnValue({
		lean: leanMock,
		exec: execMock,
	} as any);
	MongoTransactionModel.bulkWrite = jest.fn();
	MongoTransactionModel.updateMany = jest.fn();

	return MongoTransactionModel as jest.Mocked<typeof MongoTransactionModel>;
};
