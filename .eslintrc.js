module.exports = {
  extends: 'airbnb',
  rules: {
    semi: 0,
    'func-names': 0,
    indent: ['error', 2],
    'vars-on-top': 0,
    'comma-dangle': ['error', 'always-multiline'],
    'space-before-function-paren': ['error', 'always'],
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'no-undefined': 0,
    'new-parens': 0,
    'no-loop-func': 0,
  },
  globals: {
    _: true,
  },
}
