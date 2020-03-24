module.exports.rules = {
  'map': require('./lib/rules/map')
};

module.exports.configs = {
  recommended: {
    rules: {
      'lodash-to-native/map': "warn",
    },
  },
};
