/**
 * Created by priit on 26.05.15.
 */
var config = require('../../config');
var LocalExecutor = require('./executor/localExecutor');
var sessionService = require('./sessionService');

function ExecutorService() {}

ExecutorService.prototype.execute = function(serviceRequest, callback){

    if(config.service.staticOptions.type = config.serviceTypes.LOCAL){
        var localExecutor = new LocalExecutor().execute(serviceRequest, callback);
    } else {
        throw new Error('Type not defined');
    }
};

ExecutorService.prototype.getServiceResponse = function(instanceId, callback){

    sessionService.getSession(instanceId, function(session){
        sessionService.getApiResponse(session, callback);
    });

};

module.exports = ExecutorService;