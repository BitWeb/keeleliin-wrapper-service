/**
 * Created by priit on 28.05.15.
 */
var config = require('../../config');
var session = require('../service/session');

function ServiceConfig( requestData ) {
    this.queryData = JSON.parse(JSON.stringify(config.service.serviceRequestTemplate)); //clone default
    this.requestData = requestData;
    this.mapMetaOptions();
    this.mapParams();
}

ServiceConfig.prototype.mapMetaOptions = function () {
    var staticOptions = config.service.staticOptions;
    if(staticOptions.isAsync === null ){
        if(this.requestData.service.meta.isAsync != undefined){
            this.queryData.service.meta.isAsync = this.requestData.service.meta.isAsync
        }
    } else {
        this.queryData.service.meta.isAsync = staticOptions.isAsync;
    }

    if(this.requestData.service.meta.sessionId){
        this.queryData.service.meta.sessionId = this.requestData.service.meta.sessionId;
    } else {
        this.queryData.service.meta.sessionId = session.generateId();
    }
};

ServiceConfig.prototype.mapParams = function(){
    var expectedParams = this.queryData.service.params;
    for(var prop in expectedParams){
        if(this.requestData.service.params[prop]){
            this.queryData.service.params[prop] = this.requestData.service.params[prop];
        }
    }
};

module.exports = ServiceConfig;