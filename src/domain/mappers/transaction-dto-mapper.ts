import { TransactionDto } from 'src/domain/dtos';
import { TransactionModel } from 'src/domain/models';

export function transactionDtoMapper(transaction: TransactionModel): TransactionDto {
	return {
		id: transaction.id,
		title: transaction.title,
		description: transaction.description,
		date: transaction.date.toISOString(),
		amount: transaction.amount,
	};
}
