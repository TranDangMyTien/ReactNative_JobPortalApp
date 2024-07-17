// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;

// module.exports = (async () => {
//     const defaultConfig = await getDefaultConfig(__dirname);
  
//     return {
//       resolver: {
//         assetExts: [...defaultConfig.resolver.assetExts, 'ttf', 'otf'], // Add additional asset types here
//       },
//     };
//   })();