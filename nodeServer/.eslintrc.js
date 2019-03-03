module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
      "linebreak-style": 0,
      "no-plusplus": 'off',
      'no-console': 'off',
      "radix": 'off',
      "next-line": 'off'
  },
 
};
