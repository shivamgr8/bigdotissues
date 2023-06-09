module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    //presets: ['module:metro-react-native-babel-preset'],
    //plugins: ["tailwindcss-react-native/babel",'react-native-reanimated/plugin'],
    plugins: [
      "nativewind/babel",
      'react-native-reanimated/plugin',
      //'transform-remove-console'      
    ]
  };
};
