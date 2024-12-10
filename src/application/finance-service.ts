import { TransactionDto } from 'src/domain/dtos';
import { transactionDtoMapper } from 'src/domain/mappers';
import { TransactionStatus } from 'src/domain/models';
import { TransactionRepositoryPort } from 'src/domain/ports';

export class FinanceService {
	constructor(private transactionRepository: TransactionRepositoryPort) {}

	/**
	 * Fetches the completed transactions that happened on a given time range. Returns only fields that are relevant to the client.
	 * @param {Date} from - Returns only transactions after this date.
	 * @param {Date} to - Returns only transactions before this date.
	 */
	public async getTransactionsInRange(from: Date, to: Date): Promise<TransactionDto[]> {
		const transactions = await this.transactionRepository.getTransactionsInRange(
			from,
			to,
			TransactionStatus.COMPLETED,
		);
		return transactions.map(transactionDtoMapper);
	}
}
