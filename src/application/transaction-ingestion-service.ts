import { FinanceSourcePort, TransactionRepositoryPort } from 'src/domain/ports';

export class TransactionIngestionService {
	constructor(
		private transactionRepository: TransactionRepositoryPort,
		private financeSource: FinanceSourcePort,
	) {}

	/**
	 * Pulls the latest existing transactions from the source and performs a refresh operation on the transaction repository.
	 * @returns {Promise<boolean>} - Returns true if the operation was successful.
	 */
	public async refreshTransactions(): Promise<boolean> {
		const transactions = await this.financeSource.getTransactions();
		return this.transactionRepository.refreshTransactions(transactions);
	}
}
