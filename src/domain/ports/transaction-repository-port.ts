import { TransactionModel, TransactionStatus } from 'src/domain/models';


export interface TransactionRepositoryPort {
	/**
	 * Fetches the transactions within a given time range.
	 * @param {Date} from - Returns only transactions that happened after this date.
	 * @param {Date} to - Returns only transactions that happened before this date.
	 * @param {TransactionStatus} status - The status of the transactions to be fetched.
	 */
	getTransactionsInRange(from: Date, to: Date, status?: TransactionStatus): Promise<TransactionModel[]>;

	/**
	 * Given a list of the latest fetched transactions, updates the existing ones and inserts new ones.
	 * @param {TransactionModel[]} transactions - The list of the latest transactions.
	 */
	refreshTransactions(transactions: TransactionModel[]): Promise<boolean>;
}
