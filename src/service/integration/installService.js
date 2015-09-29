var config = require('../../../config');
var request = require('request');
var logger = require('log4js').getLogger('installService');

var InstallService = function() {

    var self = this;

    this.install = function(cb) {

        var wrapper = config.wrapper;
        var serviceConfig = self.getConfiguration();
        serviceConfig.apiKey = config.integration.apiKey;

        request.post({
            url: config.integration.installUrl,
            json: serviceConfig
        }, function(error, response, body) {


            logger.error('1 ',error);
            logger.error('2 ',response);
            logger.error('3 ',body);

            if (error) {
                logger.error(error);
                return cb(error);
            }

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
            var requestBodyTemplate = wrapper.requestConf.requestBodyTemplate;
            for(var property in requestBodyTemplate){
                if (requestBodyTemplate.hasOwnProperty(property)) {
                    configuration.parameters.push({
                        key: property,
                        type: wrapper.requestConf.requestBodyParamsMappings[property].type,
                        options: wrapper.requestConf.requestBodyParamsMappings[property].options,
                        value: requestBodyTemplate[property]
                    });
                }
            }
        }

        return configuration;
    };

};

module.exports = new InstallService();