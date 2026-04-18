import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactPlugin from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // ── Global ignores ────────────────────────────────────────────────────────
  globalIgnores([
    'dist/**',
    'node_modules/**',
    'storybook-static/**',
    'public/mockServiceWorker.js',
    '*.config.{js,ts,cjs,mjs}',
    'postcss.config.js',
    'tailwind.config.js',
  ]),

  // ── TypeScript + React files ──────────────────────────────────────────────
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,

      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        projectService: {
          allowDefaultProject: ['*.js', 'e2e/*.ts']
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // ── TypeScript ──────────────────────────────────────────────────────
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-empty-object-type': 'warn',

      // ── React ────────────────────────────────────────────────────────────
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/no-array-index-key': 'warn',
      'react/no-danger': 'warn',               // flag dangerouslySetInnerHTML
      'react/self-closing-comp': 'warn',
      'react/jsx-no-target-blank': ['error', { allowReferrer: false }],
      'react/no-unknown-property': 'error',
      'react/jsx-fragments': ['warn', 'syntax'], // prefer <> over <React.Fragment>

      // ── React Hooks (already extended above, extra tuning) ───────────────
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ── General best practices ───────────────────────────────────────────
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'warn',
      'prefer-template': 'warn',
      'no-nested-ternary': 'warn',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'no-duplicate-imports': 'error',
    },
  },

  // ── Test files — relax some rules ────────────────────────────────────────
  {
    files: ['**/*.{test,spec}.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
])
