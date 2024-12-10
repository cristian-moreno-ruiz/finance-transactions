import mongoose, { Document, Schema } from 'mongoose';
import { TransactionModel } from 'src/domain/models';

// Mongoose schema for the Transaction model
export const TransactionSchema: Schema = new Schema(
	{
		id: { type: String, required: true, unique: true },
		externalTransactionId: { type: Number, required: true },
		externalAccountId: { type: Number, required: true },
		title: { type: String, required: true },
		description: { type: String, required: true },
		date: { type: Date, required: true },
		amount: { type: Number, required: true },
		currency: { type: String, required: true },
		status: { type: String, required: true },
		source: { type: String, required: true },
	},
	{
		_id: false,
		timestamps: {
			createdAt: 'dates.createdAt',
			updatedAt: 'dates.updatedAt',
		},
	},
);

// Index for the main query following ESR rule (Equality: status, Range: date)
TransactionSchema.index({ status: 1, date: 1 });

// Export Mongoose model based on TransactionSchema
export const MongoTransactionModel = mongoose.model<TransactionModel & Document>(
	'Transaction',
	TransactionSchema,
);
