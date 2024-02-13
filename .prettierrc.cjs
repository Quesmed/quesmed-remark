module.exports = {
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'es5',
  printWidth: 100,
  endOfLine: 'lf',
  singleQuote: true,
  semi: true,
  plugins: [require.resolve('prettier-plugin-organize-imports')],
};
