import { FinanceService } from 'src/application';
import { TransactionDto } from 'src/domain/dtos';
import { TransactionSearchPort } from 'src/domain/ports';
import { Logger } from 'src/infrastructure/logger';

export class TransactionController implements TransactionSearchPort {
	constructor(private financeService: FinanceService) {}

	public async search(from: string, to: string): Promise<TransactionDto[]> {
		const fromDate = new Date(from as string);
		const toDate = new Date(to as string);

		Logger.log(`Getting transactions between ${fromDate} and ${toDate}`);
		return this.financeService.getTransactionsInRange(fromDate, toDate);
	}
}
