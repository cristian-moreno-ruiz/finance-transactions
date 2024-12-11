import { TransactionDto } from 'src/domain/dtos';

export interface TransactionSearchPort {
	/**
	 * Lists the available transactions whose status is completed.
	 * @param {string} from Returns only transactions that happened after this date.
	 * @param {string} to Returns only transactions that happened before this date.
	 */
	search(from: string, to: string): Promise<TransactionDto[]>;
}
