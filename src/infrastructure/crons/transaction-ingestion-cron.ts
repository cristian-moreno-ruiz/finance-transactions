import { TransactionIngestionService } from 'src/application';
import { FinanceIngestionPort } from 'src/domain/ports';
import { Logger } from 'src/infrastructure/logger';

export class TransactionIngestionCron implements FinanceIngestionPort {
	constructor(private transactionIngestion: TransactionIngestionService) {}

	async triggerTransactionRefresh(): Promise<boolean> {
		try {
			await this.transactionIngestion.refreshTransactions();
			return true;
		} catch (error) {
			Logger.error('There was an error refreshing transactions:', error);
			return false;
		}
	}
}
