module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
    }],
    ['@babel/plugin-transform-private-methods', { loose: true }], // Ensure loose mode is enabled
    ['@babel/plugin-transform-private-property-in-object', { loose: true }], // Also add this plugin with loose mode
    ['@babel/plugin-transform-class-properties', { loose: true }],
  ],
};
