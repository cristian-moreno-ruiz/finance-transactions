export interface FinanceIngestionPort {
	/**
	 * Triggers ingestion of transactions from a finance source.
	 */
	triggerTransactionRefresh(): Promise<boolean>;
}
