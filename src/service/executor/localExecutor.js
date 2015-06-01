/**
 * Created by priit on 29.05.15.
 */
var config = require('../../../config');
var LocalServiceCommand = require('../../mapper/localServiceCommand');
var Session = require('../../model/session');
var sessionService = require('../sessionService');
var fs = require('fs');

function LocalExecutor() {}

LocalExecutor.prototype.execute = function( serviceConfig, callback ) {
    var self = this;

    sessionService.getSession( serviceConfig.queryData.service.meta.sessionId, function(session){

        var localServiceCommand = new LocalServiceCommand(serviceConfig.queryData);

        localServiceCommand.generateLocalCommand(function (data) {
            console.log("Command ready");
            console.log(data);
            self.executeLocalCommand(localServiceCommand, session, callback);
        });
    });
};

LocalExecutor.prototype.executeLocalCommand = function( localServiceCommand, session, callback ) {

    session.message = Session.messages.RUNNING;
    session.success = true;
    session.isAsync = localServiceCommand.isAsync;

    var spawn = require('child_process').spawn;
    var process = spawn(localServiceCommand.command, localServiceCommand.comandParams);

    if(session.isAsync == true){
        this.runAsync(session, process,  callback);
    } else {
        this.runSync(session, process, callback);
    }
};

LocalExecutor.prototype.runSync = function( session, process, callback ) {

    session.storageType = Session.storageTypes.MEMORY;
    session.data = '';

    process.stdout.on('data', function (data) {
        session.data = session.data + data;
    });

    process.stderr.on('data', function (data) {
        console.log('Got error: ' + data);
        session.message = Session.messages.ERROR;
        session.success = false;
        session.data = session.data + data;
    });

    process.on('close', function (code, signal) {
        console.log('child process terminated due to receipt of signal: '+signal +' code: ' + code);
        session.message = Session.messages.OK;
        session.isFinished = true;
        sessionService.getApiResponse(session, callback);
    });
};

LocalExecutor.prototype.runAsync = function( session, process, callback ) {

    session.storageType = Session.storageTypes.FILE;

    var outputStream = fs.createWriteStream( sessionService.getSessionOutputPath(session), {flags: 'a'});

    process.stdout.pipe(outputStream);
    process.stderr.pipe(outputStream);

    process.stderr.on('data', function (data) {
        console.log('Got error: ' + data);
        session.message = Session.messages.ERROR;
        session.success = false;
        sessionService.saveSession(session, function(){
            console.log('Session running and saved');
        });
    });

    process.on('close', function (code, signal) {
        console.log('child process terminated due to receipt of signal: '+signal +' code: ' + code);
        session.message = Session.messages.OK;
        session.isFinished = true;

        sessionService.saveSession(session, function(){
            console.log('Session running and saved');
        });
    });

    sessionService.saveSession(session, function(){
        console.log('Session running and saved');
    });

    sessionService.getApiResponse( session, callback );
};

module.exports = LocalExecutor;