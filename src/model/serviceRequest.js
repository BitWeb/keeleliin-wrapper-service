/**
 * Created by priit on 28.05.15.
 */
var config = require('../../config');
var sessionService = require('../service/sessionService');

function ServiceRequest( requestData ) {
    this.requestData = requestData;
    this.data = JSON.parse(JSON.stringify(config.service.serviceRequestTemplate)); //clone default
    this.messages = null;
}

ServiceRequest.prototype.setMessage = function (key, value) {

    if(this.messages == null){
        this.messages = {}
    }
    this.messages[key] = value;
};

ServiceRequest.prototype._mapMetaOptions = function () {
    var staticOptions = config.service.staticOptions;
    if(staticOptions.isAsync === null ){
        if(this.requestData.service.meta.isAsync != undefined){
            this.data.service.meta.isAsync = this.requestData.service.meta.isAsync
        }
    } else {
        this.data.service.meta.isAsync = staticOptions.isAsync;
    }

    if(this.requestData.service.meta.sessionId){
        this.data.service.meta.sessionId = this.requestData.service.meta.sessionId;
    } else {
        this.data.service.meta.sessionId = sessionService.generateId();
    }
};

ServiceRequest.prototype._mapParams = function(){

    var expectedParams = this.data.service.params;

    for(var property in expectedParams){
        var value = this.requestData.service.params[property];
        var mapping = config.service.paramsMappings[property];

        if(mapping.filter){
            value = mapping.filter(value);
        }
        if(mapping.required == true && value == undefined){
            this.setMessage(property, 'Väli on nõutud');
        }
        if(mapping.allowEmpty == false && (value == null || value == '') ){
            this.setMessage(property, 'Väli on täitmata');
        }
        if(mapping.validator){
            mapping.validator(value, this);
        }
        this.data.service.params[property] = value;
    }
};

ServiceRequest.prototype.isValid = function(){
    this._mapMetaOptions();
    this._mapParams();
    return this.messages == null;
};

ServiceRequest.prototype.getMessages = function(){
    return {errors: this.messages, sucess: false};
};

ServiceRequest.prototype.getData = function(){
    return this.data;
};

module.exports = ServiceRequest;