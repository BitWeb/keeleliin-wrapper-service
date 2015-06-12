var logger = require('log4js').getLogger('service_request');
var config = require('../../config');
var sessionService = require('../service/sessionService');

function ServiceRequest( requestData ) {
    var self = this;

    this.data = requestData;
    this.template = config.service.serviceRequestTemplate;
    this.messages = null;

    this.isValid = function(){
        self._mapMetaOptions();
        self._mapParams();
        self._validatePipecontent();
        return self.messages == null;
    };

    this.setMessage = function (key, value) {

        if(self.messages == null){
            self.messages = {}
        }
        self.messages[key] = value;
    };

    this._mapMetaOptions = function () {
        var staticOptions = config.service.staticOptions;
        if(staticOptions.isAsync === null ){
            if(self.data.service.meta.isAsync === null || self.data.service.meta.isAsync === undefined){
                self.data.service.meta.isAsync = self.template.service.meta.isAsync
            }
        } else {
            self.data.service.meta.isAsync = staticOptions.isAsync;
        }

        if(!self.data.service.meta.sessionId){
            self.data.service.meta.sessionId = sessionService.generateId();
        }
    };

    this._mapParams = function(){

        var expectedParams = this.template.service.params;

        for(var property in expectedParams){

            var value = self.data.service.params[property];
            var mapping = config.service.paramsMappings[property];

            if(mapping.filter){
                value = mapping.filter(value);
            }
            if(mapping.required == true && value == undefined){
                self.setMessage(property, 'Väli on nõutud');
            }
            if(mapping.allowEmpty == false && (value == null || value == '') ){
                self.setMessage(property, 'Väli on täitmata');
            }
            if(mapping.validator){
                mapping.validator(value, self);
            }
            self.data.service.params[property] = value;
        }
    };

    this._validatePipecontent = function () {
        if(config.service.pipecontentMapping.validator){
            config.service.pipecontentMapping.validator(self.data.service.pipecontent, self);
        }
    };

    this.getMessages = function(){
        return {errors: self.messages, success: false};
    };

    this.getData = function(){
        return self.data;
    };
}

module.exports = ServiceRequest;