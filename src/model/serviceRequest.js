var logger = require('log4js').getLogger('service_request');
var config = require('../../config');

function ServiceRequest( requestBody, requestFiles ) {
    var self = this;

    this.data = requestBody;
    this.files = requestFiles;
    var messages = null;


    this.isValid = function(){
        self._mapParams();
        self._checkFiles();
        return messages == null;
    };

    this.setMessage = function (key, value) {

        if(messages == null){
            messages = {}
        }
        messages[key] = value;
    };

    this._mapParams = function(){

        var staticParams = config.wrapper.requestConf.staticParams;

        for(var property in config.wrapper.requestConf.requestBodyTemplate){

            var value = self.data[property];

            var mapping = config.wrapper.requestConf.requestBodyParamsMappings[property];

            if(staticParams[property] != undefined){
                value = staticParams[property];
            }

            if(mapping.filter){
                value = mapping.filter(value);
            }
            if(mapping.required == true && value == undefined){
                self.setMessage(property, 'Väli on nõutud');
                continue;
            }
            if(mapping.allowEmpty == false && (value === null || value === '') ){
                self.setMessage(property, 'Väli on täitmata');
                continue;
            }
            if(mapping.validator){
                mapping.validator(value, self);
            }
            self.data[property] = value;
        }
    };

    this._checkFiles = function () {

        for( var fileId in config.wrapper.requestConf.requestFiles ){
            var file = this.files[fileId];
            if(!file){
                self.setMessage(fileId, 'Nõutud faili ei saadetud');
            }
        }
    };

    this.getMessages = function(){
        return {errors: messages, success: false};
    };
}

module.exports = ServiceRequest;