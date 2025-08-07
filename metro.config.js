const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Web için resolver ayarları
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

// Web için alias'lar
config.resolver.alias = {
  'react-native': 'react-native-web',
};

module.exports = config;
