module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential'
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    // allow named exports
    'import/prefer-default-export': 'off',
    // allow async-await
    'generator-star-spacing': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 0,
    'eqeqeq': 0,
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'padded-blocks': 0,
    // allow rejection without throwing error
    'prefer-promise-reject-errors': 0,
    // allow debugger stuff during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-multiple-empty-lines': ['error', { 'max': 3, 'maxEOF': 0 }],

    'space-before-function-paren': ['error', { 'anonymous': 'always', 'named': 'never', 'asyncArrow': 'always' }],
    'no-extra-semi': ['error'],
    'semi': ['error', 'always'],
    'quote-props': ['error', 'consistent-as-needed'],

    'vue/html-indent': ['error', 2, { alignAttributesVertically: false }],
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/attributes-order': 'off',
    'vue/order-in-components': 'off',
    'vue/require-prop-types': 'off',
    'vue/require-default-prop': 'off'
  }
};
