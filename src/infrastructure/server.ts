import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import cron from 'node-cron';
import { FinanceService, TransactionIngestionService } from 'src/application';
import { TransactionController, TransactionRouter } from 'src/infrastructure/api';
import { TransactionIngestionCron } from 'src/infrastructure/crons/transaction-ingestion-cron';
import { mongoInit } from 'src/infrastructure/database';
import { MongoTransactionRepository } from 'src/infrastructure/repositories';
import { SampleSource } from 'src/infrastructure/sources';

dotenv.config();

const PORT = process.env.PORT || 3000;
const PROVIDER_URL =
	process.env.PROVIDER_URL || 'https://gist.githubusercontent.com/cristian-moreno-ruiz/40984d50552cfd94e715c3731d85d2e4/raw/f64fdba75307f2f581202d6add89b0aebc3a1c59/sample-finance-source.response.xml';
const CRON_EXPRESSION = process.env.CRON_EXPRESSION || '* * * * *';

const app: Application = express();
app.use(bodyParser.json());

async function start() {
	// Connect to MongoDB
	await mongoInit();

	// Orchestrate dependencies
	const mongoRepository = new MongoTransactionRepository();
	const transactionController = new TransactionController(new FinanceService(mongoRepository));
	const transactionRouter = new TransactionRouter(transactionController);
	const transactionIngestionCron = new TransactionIngestionCron(
		new TransactionIngestionService(mongoRepository, new SampleSource(PROVIDER_URL)),
	);

	// Initialize routes
	app.use('/transactions', transactionRouter.router);

	// Start the API server
	app.listen(PORT, () => {
		console.log(`Server running on http://localhost:${PORT}`);
	});

	// Trigger ingestion of transactions from the sample source on startup
	await transactionIngestionCron.triggerTransactionRefresh();

	// Refresh transactions every minute
	cron.schedule(CRON_EXPRESSION, async () => {
		await transactionIngestionCron.triggerTransactionRefresh();
	});
}

start();
