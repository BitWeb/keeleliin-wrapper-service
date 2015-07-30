var config = require('./global');
config.port = 3005;
config.service.title = 'Osalausestaja';
config.service.staticParams.uniqueId = 'subsentence';
config.service.staticParams.wrapper = config.availableWappers.OSALAUSESTAJA.class;
module.exports = config;