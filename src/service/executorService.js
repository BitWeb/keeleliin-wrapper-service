/**
 * Created by priit on 26.05.15.
 */
var daoService = require('./daoService');
var config = require('../../config');
var ServiceConfig = require('../model/serviceConfig');
var ServiceResponse = require('../model/serviceResponse');
var LocalServiceCommand = require('../mapper/localServiceCommand');
var LocalExecutor = require('./executor/localExecutor');


function ExecutorService() {}

ExecutorService.prototype.execute = function(param, callback){

    var serviceRequest = new ServiceConfig(param);

    if(config.service.staticOptions.type = config.serviceTypes.LOCAL){
        var localExecutor = new LocalExecutor().execute(serviceRequest, callback);
    } else {
        throw new Error('Type not defined');
    }
};

module.exports = ExecutorService;