var config = {};

config.key = "heweather key";

var localSettings = null;
try {
  localSettings = require('./config.local');
  Object.assign(config, localSettings);
} catch (e) { }
//previow  mode
module.exports = config;
