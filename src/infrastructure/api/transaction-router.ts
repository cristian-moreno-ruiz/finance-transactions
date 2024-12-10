import { Request, Response, Router } from 'express';
import { TransactionController } from 'src/infrastructure/api/transaction-controller';
import { Logger } from 'src/infrastructure/logger';

export class TransactionRouter {
	public router: Router;

	constructor(private transactionController: TransactionController) {
		this.router = Router();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get('/search', this.searchTransactions.bind(this));
	}

	private async searchTransactions(req: Request, res: Response) {
		const { from, to } = req.query;

		// Input validation for query parameters
		if (!from || !to || !this.isValidDate(from) || !this.isValidDate(to)) {
			res.status(400).json({
				data: null,
				error: {
					code: 400,
					message: 'Please provide valid dates for both from and to query parameters.',
				},
			});
			return;
		}

		try {
			const transactions = await this.transactionController.search(from as string, to as string);
			res.json({ data: { transactions }, error: null });
		} catch (error) {
			Logger.error('Error fetching transactions:', error);
			res.status(500).json({ data: null, error: { code: 500, message: 'Internal server error' } });
		}
	}

	private isValidDate(date: any): boolean {
		return !isNaN(new Date(date).getTime());
	}
}
