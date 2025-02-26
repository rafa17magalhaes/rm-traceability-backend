import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['**/*.ts'],
    ignores: ['eslint.config.mjs', 'node_modules', 'dist'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        console: 'readonly',
        // Globais do Jest
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',

      // Desativa avisos de variáveis não usadas
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',

      // Desativa a regra do Prettier (se preferir, ou ajuste no .prettierrc)
      'prettier/prettier': 'off',
    },
  },

  // Mantém apenas a configuração do Prettier (opcional)
  prettierRecommended,
];
