/**
 * Created by priit on 29.05.15.
 */
var daoService = require('./../daoService');
var config = require('../../../config');
var ServiceConfig = require('../../model/serviceConfig');
var ServiceResponse = require('../../model/serviceResponse');
var LocalServiceCommand = require('../../mapper/localServiceCommand');

function LocalExecutor() {}

////serviceRequest.queryData.service.meta.isAsync == true

LocalExecutor.prototype.execute = function( serviceRequest, callback ) {
    var self = this;
    console.log(serviceRequest.queryData);

    var localServiceCommand = new LocalServiceCommand(serviceRequest.queryData);

    localServiceCommand.generateLocalCommand(function (data) {
        console.log("Command ready");
        console.log(data);
        self.executeLocalCommand(localServiceCommand, callback);
    });
};

LocalExecutor.prototype.executeLocalCommand = function( localServiceCommand, callback ) {

    var serviceResponse = new ServiceResponse(localServiceCommand.sessionId);


    var output = '';
    var isAsync = localServiceCommand.isAsync;

    var spawn = require('child_process').spawn;

    console.log('Childprocess params');
    console.log(localServiceCommand.command);
    console.log(localServiceCommand.comandParams);

    var pwd = spawn(localServiceCommand.command, localServiceCommand.comandParams);

    pwd.on('message', function (data) {
        console.log('message');
        console.log(data);
    });

    pwd.stdout.on('data', function (data) {
        console.log('Got data');
        if(isAsync == false){
            output += data.toString();
        } else {
            //todo
        }
        console.log(data.toString());
    });

    pwd.stderr.on('data', function (data) {
        console.log('Got error');
        if(isAsync == false){
            output += data.toString();
            serviceResponse.message = serviceResponse.message = serviceResponse.messages.ERROR
        } else {
            //todo
        }
        console.log(data.toString());
    });

    pwd.on('close', function (code, signal) {
        console.log('child process terminated due to receipt of signal: '+signal +' code: ' + code);

        if(isAsync == false){
            serviceResponse.data = output;
            callback( serviceResponse.getApiResponse() );
        } else {
            //todo
        }

    });

    if(isAsync == true){
        callback( serviceResponse.getApiResponse() );

    }

    return pwd;
};

LocalExecutor.prototype.getServiceResponse = function(instanceId, cb){
    var instanceMeta = daoService.get(instanceId, function( instanceMeta ){

        //if finished remove files data

        cb(
            {
                title:"Hello me",
                id: instanceId,
                meta: instanceMeta
            }
        );
    });
};

module.exports = LocalExecutor;