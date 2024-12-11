import { TransactionIngestionService } from 'src/application/';
import { TransactionRepositoryPort } from 'src/domain/ports';
import { FinanceSourcePort } from 'src/domain/ports/finance-source-port';
import { multipleTransactionsFixture } from 'tests/__fixtures__/transaction-model.fixtures';
import { createMockFinanceSource } from 'tests/__mocks__/finance-source-port.mock';
import { createMockTransactionRepository } from 'tests/__mocks__/transaction-repository-port.mock';

describe('TransactionIngestionService', () => {
	let service: TransactionIngestionService;
	let mockTransactionRepository: jest.Mocked<TransactionRepositoryPort>;
	let mockFinanceSource: jest.Mocked<FinanceSourcePort>;

	beforeEach(() => {
		mockTransactionRepository = createMockTransactionRepository();
		mockFinanceSource = createMockFinanceSource();
		service = new TransactionIngestionService(mockTransactionRepository, mockFinanceSource);
	});

	describe('refreshTransactions', () => {
		it('should call getTransactions from TransactionSource and refreshTransactions from TransactionRepository', async () => {
			const transactions = multipleTransactionsFixture;
			mockFinanceSource.getTransactions.mockResolvedValue(transactions);
			mockTransactionRepository.refreshTransactions.mockResolvedValue(true);

			const result = await service.refreshTransactions();

			expect(mockFinanceSource.getTransactions).toHaveBeenCalled();
			expect(mockTransactionRepository.refreshTransactions).toHaveBeenCalledWith(transactions);
			expect(result).toBe(true);
		});

		it('should throw error if getTransactions fails', async () => {
			mockFinanceSource.getTransactions.mockRejectedValue(
				new Error('Failed to fetch transactions'),
			);

			await expect(service.refreshTransactions()).rejects.toThrow('Failed to fetch transactions');
		});

		it('should throw if refreshTransactions fails', async () => {
			mockTransactionRepository.refreshTransactions.mockRejectedValue(
				new Error('Failed to refresh active transactions'),
			);

			await expect(service.refreshTransactions()).rejects.toThrow(
				'Failed to refresh active transactions',
			);
		});
	});
});
