module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['typeParameter', 'typeAlias'],
        format: ['PascalCase'],
        prefix: ['t'],
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['i'],
      },
    ],
  },
};
