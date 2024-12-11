import { FinanceService } from 'src/application';
import { transactionDtoMapper } from 'src/domain/mappers';
import { TransactionController } from 'src/infrastructure/api/transaction-controller';
import { completedTransactionFixture } from 'tests/__fixtures__/transaction-model.fixtures';

describe('TransactionController', () => {
	let transactionController: TransactionController;
	let financeService: jest.Mocked<FinanceService>;

	beforeEach(() => {
		jest.spyOn(console, 'log').mockImplementation(jest.fn());
		financeService = {
			getTransactionsInRange: jest.fn(),
		} as unknown as jest.Mocked<FinanceService>;

		transactionController = new TransactionController(financeService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should call getTransactionsInRange with correct date range and return transactions', async () => {
		const transactionDto = transactionDtoMapper(completedTransactionFixture);
		financeService.getTransactionsInRange.mockResolvedValue([transactionDto]);

		const from = '2021-01-01';
		const to = '2021-12-31';

		const result = await transactionController.search(from, to);

		expect(financeService.getTransactionsInRange).toHaveBeenCalledWith(
			new Date(from),
			new Date(to),
		);
		expect(result).toEqual([transactionDto]);
	});

	it('should throw an error if getTransactionsInRange throws an error', async () => {
		financeService.getTransactionsInRange.mockRejectedValue(new Error('Database error'));

		await expect(transactionController.search('2021-01-01', '2021-12-31')).rejects.toThrow(
			'Database error',
		);
		expect(financeService.getTransactionsInRange).toHaveBeenCalledWith(
			new Date('2021-01-01'),
			new Date('2021-12-31'),
		);
	});
});
