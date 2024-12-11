import { TransactionModel } from 'src/domain/models';
import { TransactionStatus } from 'src/domain/models/transaction-status';
import { TransactionRepositoryPort } from 'src/domain/ports';
import { MongoTransactionModel } from 'src/infrastructure/repositories';

export class MongoTransactionRepository implements TransactionRepositoryPort {
	public async getTransactionsInRange(
		from: Date,
		to: Date,
		status?: TransactionStatus,
	): Promise<TransactionModel[]> {
		const query: Record<string, unknown> = { date: { $gte: from, $lte: to } };
		if (status) {
			query.status = status;
		}

		const transactions = await MongoTransactionModel.find(query).lean().exec();
		return transactions;
	}

	public async refreshTransactions(transactions: TransactionModel[]): Promise<boolean> {
		const bulkOps = transactions.map((transaction) => ({
			updateOne: {
				filter: {
					externalTransactionId: transaction.externalTransactionId,
					externalAccountId: transaction.externalAccountId,
					source: transaction.source,
				},
				update: { ...transaction },
				upsert: true, // Insert if not found
			},
		}));

		const result = await MongoTransactionModel.bulkWrite(bulkOps);
		return !!result.ok;
	}
}
