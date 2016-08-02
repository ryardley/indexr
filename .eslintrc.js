module.exports = {
  extends: 'airbnb',
  installedESLint: true,
  parser: 'babel-eslint',
  rules: {
    'no-console': 0,
    'no-confusing-arrow': 0,
    'curly': 0,
  },
  plugins: [
    'mocha'
  ],
  env: {
    mocha: true
  }
};
