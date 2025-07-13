import js from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
	js.configs.recommended,
	eslintConfigPrettier,
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				console: 'readonly',
				process: 'readonly',
				Buffer: 'readonly',
				__dirname: 'readonly',
				__filename: 'readonly',
				global: 'readonly',
				require: 'readonly',
				module: 'readonly',
				exports: 'readonly'
			}
		},
		plugins: {
			prettier: eslintPluginPrettier
		},
		rules: {
			// Erreurs de syntaxe et logique
			'no-console': 'warn',
			'no-debugger': 'error',
			'no-unused-vars': 'error',
			'no-undef': 'off', // Désactiver temporairement pour éviter les erreurs d'import
			'no-unreachable': 'error',

			// Bonnes pratiques
			eqeqeq: 'error',
			'no-eval': 'error',
			'no-implied-eval': 'error',
			'no-new-func': 'error',
			'no-return-assign': 'error',
			'no-sequences': 'error',
			'no-throw-literal': 'error',
			'no-with': 'error',
			'prefer-const': 'error',
			'no-var': 'error',

			// Prettier integration
			'prettier/prettier': 'error',

			// Async/await
			'no-async-promise-executor': 'error',
			'require-await': 'warn'
		}
	},
	{
		ignores: ['node_modules/**', 'dist/**']
	}
];
