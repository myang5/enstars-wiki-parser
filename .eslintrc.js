module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  extends: ['plugin:react/recommended', 'plugin:jest/recommended', 'airbnb'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'jest'],
  rules: {
    'linebreak-style': 0,
    'eol-last': 0,
    'arrow-parens': 0,
    'no-use-before-define': 0,
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'react/prop-types': 0,
    'jsx-a11y/label-has-associated-control': [2, { assert: 'either' }],
    'react/jsx-one-expression-per-line': [2, { allow: 'single-child' }],
    'object-curly-newline': 0,
    'no-disabled-tests': 0,
  },
};
