export default {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:workspaces/recommended',
  ],
  settings: {
    react: {
      version: '18',
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    ecmaFeatures: {
      jsx: true,
    },
  },
};
