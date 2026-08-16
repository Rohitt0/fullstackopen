const js = require('@eslint/js')
const globals = require('globals')
const stylistic = require('@stylistic/eslint-plugin')

module.exports = [
  js.configs.recommended,

  {
    files: ['**/*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node
      }
    },

    plugins: {
      '@stylistic': stylistic
    },

    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/comma-dangle': ['error', 'never'],
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_'
      }],
      'no-console': 'off'
    }
  },

  {
    ignores: [
      'node_modules/**',
      'dist/**'
    ]
  }
]