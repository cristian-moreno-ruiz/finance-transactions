import { TransactionStatus } from 'src/domain/models/transaction-status';
import { MongoTransactionModel, MongoTransactionRepository } from 'src/infrastructure/repositories';
import { multipleTransactionsFixture } from 'tests/__fixtures__/transaction-model.fixtures';
import { createMockMongoTransactionModel } from 'tests/__mocks__/mongo-transaction-model.mock';
jest.mock('src/infrastructure/repositories/mongo-transaction-schema');

describe('MongoTransactionRepository', () => {
	let repository: MongoTransactionRepository;
	let mockedMongoTransactionModel: jest.Mocked<typeof MongoTransactionModel>;

	beforeEach(() => {
		mockedMongoTransactionModel = createMockMongoTransactionModel();
		repository = new MongoTransactionRepository();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getTransactionsInRange', () => {
		it('should query transactions within a given date range', async () => {
			await repository.getTransactionsInRange(new Date('2023-01-01'), new Date('2023-01-03'));

			expect(mockedMongoTransactionModel.find).toHaveBeenCalledWith({
				date: { $gte: new Date('2023-01-01'), $lte: new Date('2023-01-03') },
			});
		});

		it('should filter by status if provided', async () => {
			await repository.getTransactionsInRange(
				new Date('2023-01-01'),
				new Date('2023-01-03'),
				TransactionStatus.COMPLETED,
			);

			expect(mockedMongoTransactionModel.find).toHaveBeenCalledWith({
				date: { $gte: new Date('2023-01-01'), $lte: new Date('2023-01-03') },
				status: TransactionStatus.COMPLETED,
			});
		});
	});

	describe('refreshTransactions', () => {
		it('should bulk upsert transactions', async () => {
			mockedMongoTransactionModel.bulkWrite.mockResolvedValue({ ok: 1 } as any);
			const transactions = multipleTransactionsFixture;

			const result = await repository.refreshTransactions(transactions);

			const bulkWriteArgs = mockedMongoTransactionModel.bulkWrite.mock.calls[0];
			expect(bulkWriteArgs).toMatchSnapshot();
			expect(result).toBe(true);
		});
	});
});
