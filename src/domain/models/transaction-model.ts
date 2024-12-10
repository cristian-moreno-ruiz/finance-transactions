import { TransactionStatus } from 'src/domain/models';
import { FinanceSourceEnum } from 'src/infrastructure/sources';

export interface TransactionModel {
	id: string;
	externalTransactionId: number;
	externalAccountId: number;
	title: string;
	description: string;
	date: Date;
	amount: number;
	currency: string;
	status: TransactionStatus;
	source: FinanceSourceEnum;
}
