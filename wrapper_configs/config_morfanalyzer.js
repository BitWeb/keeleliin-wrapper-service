var config = require('./config_global');
config.port = 3003;
config.service.title = 'Morfoloogiline analüüs';
config.service.staticParams.uniqueId = 'morfanalyzer';
config.service.staticParams.wrapper = config.availableWappers.MORFANALYZER.class;
module.exports = config;