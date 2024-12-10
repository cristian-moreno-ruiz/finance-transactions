import { TransactionModel, TransactionStatus } from 'src/domain/models';
import { FinanceSourceEnum } from 'src/infrastructure/sources';

export const completedTransactionFixture: TransactionModel = {
	id: '123e4567-e89b-12d3-a456-426614174000',
	externalTransactionId: 291,
	externalAccountId: 1234,
	title: 'Direct Debit',
	description: 'Payment for Rent',
	date: new Date('2024-06-30T21:00:00.000Z'),
	status: TransactionStatus.PENDING,
	amount: -100,
	currency: 'EUR',
	source: FinanceSourceEnum.SAMPLE_SOURCE,
};

export const pendingTransactionFixture: TransactionModel = {
	id: '123e4567-e89b-12d3-a456-426614174000',
	externalTransactionId: 1642,
	externalAccountId: 1234,
	title: 'Electricity Bill',
	description: 'Payment for Electricity',
	date: new Date('2024-10-01T20:00:00.000Z'),
	status: TransactionStatus.PENDING,
	amount: -50,
	currency: 'EUR',
	source: FinanceSourceEnum.SAMPLE_SOURCE,
};

// Array of transactions fixtures for bulk testing
export const multipleTransactionsFixture: TransactionModel[] = [
	completedTransactionFixture,
	pendingTransactionFixture,
];
