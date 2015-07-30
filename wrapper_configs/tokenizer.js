var config = require('./global');
config.port = 3002;
config.service.title = 'Sõnestaja';
config.service.staticParams.uniqueId = 'tokenizer';
config.service.staticParams.wrapper = config.availableWappers.TOKENIZER.class;
module.exports = config;