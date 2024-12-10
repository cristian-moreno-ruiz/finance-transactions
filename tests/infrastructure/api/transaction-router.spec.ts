import express from 'express';
import { transactionDtoMapper } from 'src/domain/mappers';
import { TransactionController } from 'src/infrastructure/api/transaction-controller';
import { TransactionRouter } from 'src/infrastructure/api/transaction-router';
import { Logger } from 'src/infrastructure/logger';
import request from 'supertest';
import { completedTransactionFixture } from 'tests/__fixtures__/transaction-model.fixtures';

jest.mock('src/infrastructure/logger');

describe('TransactionRouter', () => {
	let transactionController: jest.Mocked<TransactionController>;
	let app: express.Express;

	beforeEach(() => {
		// Create a mocked instance of TransactionController
		transactionController = { search: jest.fn() } as unknown as jest.Mocked<TransactionController>;

		// Create an instance of TransactionRouter with the mocked TransactionController
		const transactionRouter = new TransactionRouter(transactionController);

		// Set up an Express app with the router for testing
		app = express();
		app.use(express.json());
		app.use('/', transactionRouter.router);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return 400 if from or to query parameters are missing', async () => {
		const response = await request(app).get('/search');

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			data: null,
			error: {
				code: 400,
				message: 'Please provide valid dates for both from and to query parameters.',
			},
		});
	});

	it('should return 400 if from or to are invalid dates', async () => {
		const response = await request(app)
			.get('/search')
			.query({ from: 'invalid-date', to: '2021-12-31' });

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			data: null,
			error: {
				code: 400,
				message: 'Please provide valid dates for both from and to query parameters.',
			},
		});
	});

	it('should return 200 and list of transactions if search is successful', async () => {
		const transactionDto = transactionDtoMapper(completedTransactionFixture);
		transactionController.search.mockResolvedValue([transactionDto]);

		const response = await request(app)
			.get('/search')
			.query({ from: '2023-01-01', to: '2023-12-31' });

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			data: { transactions: [transactionDto] },
			error: null,
		});
		expect(transactionController.search).toHaveBeenCalledWith('2023-01-01', '2023-12-31');
	});

	it('should return 500 if transactionController.search throws an error', async () => {
		transactionController.search.mockRejectedValue(new Error('Database error'));

		const response = await request(app)
			.get('/search')
			.query({ from: '2023-01-01', to: '2023-12-31' });

		expect(response.status).toBe(500);
		expect(response.body).toEqual({
			data: null,
			error: { code: 500, message: 'Internal server error' },
		});
		expect(Logger.error).toHaveBeenCalledWith('Error fetching transactions:', expect.any(Error));
	});
});
