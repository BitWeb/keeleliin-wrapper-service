var config = require('../../../config');
var request = require('request');
var logger = require('log4js').getLogger('installService');

var InstallService = function() {

    var self = this;

    this.install = function(cb) {
        var wrapper = config.wrapper;
        request.post({
            url: self._composeInstallUrl(config.integration.installUrl, wrapper.id, self._getApiKey()),
            json: self.getConfiguration()
        }, function(error, response, body) {
            if (error) {
                logger.error(error);
                return cb(error);
            }
            var data = {
                errors: null,
                data: null
            };

            if (body != undefined) {
                if (body.errors) {
                    data.errors = body.errors;
                }
                if (body.data) {
                    data.data = body.data;
                }
            }

            logger.debug(data);

            return cb(data.errors, data.data);
        });
    };

    this.getConfiguration = function() {
        var configuration = {};
        var wrapper = config.wrapper;

        if (wrapper.requestConf) {
            configuration.sid = wrapper.id;
            configuration.name = wrapper.title;
            configuration.description = wrapper.description;
            configuration.url = self._composeUrl(config.serverUrl, wrapper.port);
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
                    if (wrapper.requestConf.requestBodyParamsMappings[property].usageType != config.paramUsageTypes.META) {
                        configuration.parameters.push({
                            key: property,
                            type: wrapper.requestConf.requestBodyParamsMappings[property].type,
                            value: requestBodyTemplate[property]
                        });
                    }

                }
            }
        }

        return configuration;
    };

    this._composeUrl = function(serverUrl, port) {

        return serverUrl + (port ? ':' + port  : '') + '/api/v1/';
    };

    this._composeInstallUrl = function(installUrl, serviceId, apiKey) {

        return installUrl + '/sid/' + serviceId + '/apiKey/' + apiKey;
    };

    // Gets API key as argv, i.e., "apiKey=somethingsomething"
    this._getApiKey = function() {
        var apiKey = '';
        if (process.argv.length > 0) {
            for (var i = 0; i < process.argv.length; i++) {
                var arg = process.argv[i];
                var s = 'apiKey';
                if (arg.indexOf(s) > -1) {
                    apiKey = arg.substring(s.length + 1);
                }
            }
        }

        return apiKey;
    }
};

module.exports = new InstallService();