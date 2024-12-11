/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { TransactionModel } from 'src/domain/models';
import { TransactionStatus } from 'src/domain/models/transaction-status';
import { FinanceSourcePort } from 'src/domain/ports/finance-source-port';
import { Logger } from 'src/infrastructure/logger';
import { FinanceSourceEnum } from 'src/infrastructure/sources/finance-source-enum';
import { v4 } from 'uuid';
import * as xml2js from 'xml2js';

export class SampleSource implements FinanceSourcePort {
	private readonly providerUrl: string;

	constructor(providerUrl: string) {
		this.providerUrl = providerUrl;
	}

	async getTransactions(): Promise<TransactionModel[]> {
		try {
			// Fetch XML data from the provider endpoint
			const response = await axios.get(this.providerUrl, { responseType: 'text' });
			const xmlData = response.data;

			// Parse XML data into JSON format
			const jsonData = await this.parseXml(xmlData);

			// Transform JSON data into TransactionModel objects
			const transactions = this.transformToTransactionModels(jsonData);
			Logger.log(`Successfully fetched ${transactions.length} transactions from the provider.`);
			return transactions;
		} catch (error) {
			Logger.error('Failed to fetch or parse provider transactions:', error);
			throw new Error('Could not fetch transactions from the provider.');
		}
	}

	/**
	 * Parses XML data into JSON.
	 */
	private async parseXml(xmlData: string): Promise<Record<string, unknown>> {
		return new Promise((resolve, reject) => {
			xml2js.parseString(xmlData, { explicitArray: false }, (error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			});
		});
	}

	/**
	 * Transforms JSON data into a list of TransactionModel objects.
	 */
	private transformToTransactionModels(jsonData: Record<string, any>): TransactionModel[] {
		const transactions: TransactionModel[] = [];
		const output = jsonData.transactionList.output;

		const transactionDetails = Array.isArray(output.transaction)
			? output.transaction
			: [output.transaction];
		for (const transaction of transactionDetails) {
			transactions.push({
				id: v4(),
				externalTransactionId: parseInt(transaction.$.transaction_id, 10),
				externalAccountId: parseInt(transaction.$.account_id, 10),
				title: transaction.$.title,
				description: transaction.$.description,
				date: new Date(transaction.$.date),
				status:
					transaction.$.status === 'completed'
						? TransactionStatus.COMPLETED
						: TransactionStatus.PENDING,
				amount: parseFloat(transaction.$.amount),
				currency: transaction.$.currency,
				source: FinanceSourceEnum.SAMPLE_SOURCE,
			});
		}

		return transactions;
	}
}
