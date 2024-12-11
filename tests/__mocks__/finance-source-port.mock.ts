import { FinanceSourcePort } from 'src/domain/ports';

export const createMockFinanceSource = (): jest.Mocked<FinanceSourcePort> => ({
	getTransactions: jest.fn(),
});
