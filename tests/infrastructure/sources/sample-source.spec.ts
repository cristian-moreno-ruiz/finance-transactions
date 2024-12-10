import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { SampleSource } from 'src/infrastructure/sources';
import { v4 as uuidv4 } from 'uuid';

const xmlFilePath = path.resolve(
	__dirname,
	'tests/../../../__fixtures__/sample-finance-source.response.xml',
);
const xmlResponse = fs.readFileSync(xmlFilePath, 'utf-8');
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const providerUrl = 'http://test-url.com';

// mock uuid
jest.mock('uuid', () => ({ v4: jest.fn() }));
const mockedUuid = uuidv4 as jest.MockedFunction<typeof uuidv4>;

describe('SampleSource', () => {
	let sampleSource: SampleSource;

	beforeEach(() => {
		jest.spyOn(console, 'error').mockImplementation(jest.fn());
		jest.spyOn(console, 'log').mockImplementation(jest.fn());
		sampleSource = new SampleSource(providerUrl);
		jest.clearAllMocks();
		mockedUuid.mockReturnValue('123e4567-e89b-12d3-a456-426614174000' as unknown as Uint8Array);
	});

	it('should fetch and parse XML data into TransactionModel objects', async () => {
		mockedAxios.get.mockResolvedValue({ data: xmlResponse });

		const transactions = await sampleSource.getTransactions();

		expect(transactions).toHaveLength(3);
		expect(transactions).toMatchSnapshot();
	});

	it('should throw an error when the XML data is invalid', async () => {
		const invalidXmlResponse = '<invalid><data></data></invalid>';
		mockedAxios.get.mockResolvedValue({ data: invalidXmlResponse });

		await expect(sampleSource.getTransactions()).rejects.toThrow(
			'Could not fetch transactions from the provider.',
		);
	});

	it('should throw an error when the provider URL is unreachable', async () => {
		mockedAxios.get.mockRejectedValue(new Error('Network Error'));

		await expect(sampleSource.getTransactions()).rejects.toThrow(
			'Could not fetch transactions from the provider.',
		);
	});
});
