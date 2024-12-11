/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
	bail: true,
	errorOnDeprecated: true,
	logHeapUsage: true,
	moduleFileExtensions: ['ts', 'js', 'json'],
	preset: 'ts-jest',
	verbose: false,
	testEnvironment: 'node',
	moduleDirectories: ['node_modules', 'src'],
	testMatch: ['**/tests/**/*.spec.ts'],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
	modulePaths: ['<rootDir>'],
};
