var config = require('./config_global');
config.port = 3004;
config.service.title = 'Arhiivi lahtipakkija';
config.service.staticParams.uniqueId = 'unzipper';
config.service.staticParams.wrapper = config.availableWappers.ARCHIVE_EXTRACTOR.class;
module.exports = config;