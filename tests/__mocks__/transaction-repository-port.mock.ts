import { TransactionRepositoryPort } from 'src/domain/ports';

export const createMockTransactionRepository = (): jest.Mocked<TransactionRepositoryPort> => ({
	getTransactionsInRange: jest.fn(),
	refreshTransactions: jest.fn(),
});
