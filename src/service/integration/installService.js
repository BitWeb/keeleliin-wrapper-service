var config = require('../../../config');
var request = require('request');
var async = require('async');
var logger = require('log4js').getLogger('installService');

var InstallService = function() {

    var self = this;

    this.install = function(cb) {

        var wrapper = config.wrapper;
        var serviceConfig = self.getConfiguration();

        async.each(config.integration, function (serverConf, innerCb) {

            logger.debug(serverConf);

            serviceConfig.apiKey = serverConf.apiKey;
            request.post({
                url: serverConf.installUrl,
                json: serviceConfig
            }, function(error, response, body) {
                if(error){
                    logger.error( serverConf.installUrl);
                    logger.error(self.getConfiguration());
                    logger.error(error);

                    return innerCb(error);
                }
                innerCb(null, true);
            });

        }, function (err) {
            logger.debug('Installed');
            cb(err, true)
        });
    };

    this.getConfiguration = function() {
        var configuration = {};
        var wrapper = config.wrapper;

        if (wrapper.requestConf) {
            configuration.sid = wrapper.id;
            configuration.name = wrapper.title;
            configuration.description = wrapper.description;
            configuration.url = config.serverUrl + ':' + wrapper.port + '/api/v1/';
            configuration.inputTypes = [];
            configuration.outputTypes = [];

            if (wrapper.requestConf) {
                var requestFiles = wrapper.requestConf.requestFiles;
                for (var key in requestFiles) {
                    if (requestFiles.hasOwnProperty(key)) {
                        var fileConfig = requestFiles[key];
                        configuration.inputTypes.push({
                            key: key,
                            type: fileConfig.type,
                            sizeLimit: fileConfig.sizeLimit,
                            sizeUnit: fileConfig.sizeUnit,
                            isList: fileConfig.isList
                        });
                    }
                }
            }

            if (wrapper.outputTypes) {
                configuration.outputTypes = wrapper.outputTypes;
            }

            configuration.parameters = [];

            for(var property in wrapper.requestConf.requestBodyParamsMappings){

                configuration.parameters.push({
                    key: property,
                    type: wrapper.requestConf.requestBodyParamsMappings[property].type,
                    options: wrapper.requestConf.requestBodyParamsMappings[property].options,
                    value: wrapper.requestConf.requestBodyParamsMappings[property].value
                });
            }
        }

        return configuration;
    };

};

module.exports = new InstallService();