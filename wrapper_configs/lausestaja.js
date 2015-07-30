var config = require('./global');
config.port = 3005;
config.service.title = 'Lausestaja';
config.service.staticParams.uniqueId = 'sentence';
config.service.staticParams.wrapper = config.availableWappers.LAUSESTAJA.class;
module.exports = config;