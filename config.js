var config = {};

config.key = "heweather key";
config.rss = "rss/rss.xml"

var localSettings = null;
try {
  localSettings = require('./config.local');
  Object.assign(config, localSettings);
} catch (e) { }
//previow  mode
module.exports = config;
