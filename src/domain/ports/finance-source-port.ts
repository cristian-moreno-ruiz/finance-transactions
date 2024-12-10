import { TransactionModel } from 'src/domain/models';

export interface FinanceSourcePort {
	/**
	 * Fetches latest transactions from a finance source.
	 */
	getTransactions(): Promise<TransactionModel[]>;
}
