import { transactionDtoMapper } from 'src/domain/mappers';
import {
	completedTransactionFixture,
	pendingTransactionFixture,
} from 'tests/__fixtures__/transaction-model.fixtures';

describe('TransactionDtoMapper', () => {
	it('should map an transaction model with completed status', () => {
		const transactionDto = transactionDtoMapper(completedTransactionFixture);

		expect(transactionDto).toMatchInlineSnapshot(`
		{
		  "amount": -100,
		  "date": "2024-06-30T21:00:00.000Z",
		  "description": "Payment for Rent",
		  "id": "123e4567-e89b-12d3-a456-426614174000",
		  "title": "Direct Debit",
		}
	`);
	});

	it('should map an transaction model without pending status', () => {
		const transactionDto = transactionDtoMapper(pendingTransactionFixture);

		expect(transactionDto).toMatchInlineSnapshot(`
		{
		  "amount": -50,
		  "date": "2024-10-01T20:00:00.000Z",
		  "description": "Payment for Electricity",
		  "id": "123e4567-e89b-12d3-a456-426614174000",
		  "title": "Electricity Bill",
		}
	`);
	});
});
