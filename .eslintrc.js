module.exports = {
	env: {
		node: true,
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'comma-dangle': ['error', 'always-multiline'],
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		'quote-props': ['error', 'as-needed'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'spaced-comment': ['warn', 'always'],
	},
};
