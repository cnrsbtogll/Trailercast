module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'react' }]],
    plugins: [
      // Reanimated 4 / worklets plugin must be listed LAST.
      'react-native-worklets/plugin',
    ],
  };
};