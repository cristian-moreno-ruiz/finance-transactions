import { FinanceService } from 'src/application';
import { TransactionStatus } from 'src/domain/models';
import { TransactionRepositoryPort } from 'src/domain/ports';
import { completedTransactionFixture } from 'tests/__fixtures__/transaction-model.fixtures';
import { createMockTransactionRepository } from 'tests/__mocks__/transaction-repository-port.mock';

describe('FinanceService', () => {
	let financeService: FinanceService;
	let mockTransactionRepository: jest.Mocked<TransactionRepositoryPort>;

	beforeEach(() => {
		mockTransactionRepository = createMockTransactionRepository();
		financeService = new FinanceService(mockTransactionRepository);
	});

	it('should return mapped TransactionDtos', async () => {
		mockTransactionRepository.getTransactionsInRange.mockResolvedValueOnce([
			completedTransactionFixture,
		]);

		const result = await financeService.getTransactionsInRange(
			new Date('2024-01-01'),
			new Date('2024-12-31'),
		);

		expect(mockTransactionRepository.getTransactionsInRange).toHaveBeenCalledWith(
			expect.any(Date),
			expect.any(Date),
			TransactionStatus.COMPLETED,
		);
		expect(result).toMatchInlineSnapshot(`
		[
		  {
		    "amount": -100,
		    "date": "2024-06-30T21:00:00.000Z",
		    "description": "Payment for Rent",
		    "id": "123e4567-e89b-12d3-a456-426614174000",
		    "title": "Direct Debit",
		  },
		]
	`);
	});
});
