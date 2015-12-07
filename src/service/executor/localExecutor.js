var logger = require('log4js').getLogger('local_executor');
var sessionService = require('../../service/sessionService');
var LocalCommand = require('../../mapper/localCommand');
var spawn = require('child_process').spawn;
var fs = require('fs');
var async = require('async');


function LocalExecutor() {
    var self = this;

    this.execute = function (commandModel, session, callback) {

        var response = {
            isSuccess:true,
            stdOutPath: sessionService.getNewSessionFilePath(commandModel.session, {extension: commandModel.stdOutExtension}),
            errors: [],
            pid: null
        };

        var localCommand = new LocalCommand(commandModel).generate();
        self._executeLocalCommand(localCommand, session, response, callback);
    };

    this._executeLocalCommand = function (localCommand, session, response, cb) {

        var command = localCommand.command;
        var commandParams = localCommand.commandParams;

        //logger.debug(localCommand.command);
        //logger.debug(localCommand.commandParams);

        var process = spawn(command, commandParams);

        session.pid = process.pid;
        session.addLog({command: command, attributes: commandParams});

        async.waterfall([
            function (callback) {
                sessionService.saveSession( session, function (err, session) {
                    callback();
                });
            },
            function (callback) {
                self._run(response, process, function (err, response) {
                    callback(err, response);
                });
            },
            function (response, callback) {
                session.pid = null;
                sessionService.saveSession( session, function (err, session) {
                    callback(err, response);
                });
            }
        ], function (err, response) {
            cb(err, response);
        });
    };

    this._run = function (response, process, callback) {

        var outputStream = fs.createWriteStream(response.stdOutPath, {flags: 'a'});
        process.stdout.pipe(outputStream);
        //process.stderr.pipe(outputStream);

        process.stderr.on('data', function (data) {
            logger.error('Got std error: ' + data);
            //response.isSuccess = false;
            //response.errors.push({util:data.toString()});
        });

        process.on('error', function (data) {
            logger.error('Got process error: ' + data);
            response.isSuccess = false;
            response.errors.push({util:data.toString()});
        });

        process.on('exit', function (code, signal) {
            logger.debug('Child process EXIT due to receipt of signal: ' + signal + ' code: ' + code);

            if(code && code > 0){
                response.isSuccess = false;
            }
        });

        process.on('close', function (code, signal) {
            logger.debug('child process terminated due to receipt of signal: ' + signal + ' code: ' + code);

            if(signal == 'SIGKILL'){
                response.isSuccess = false;
                response.errors.push({util:' Utiliidi töö katkestati!'});
            }
            callback(null, response);
        });
    };

    this.kill = function (session, callback) {

        logger.debug('Kill system process');

        if(session.pid){
            try{
                process.kill( session.pid, 'SIGKILL' );
                callback(null, 'Katkestamise signaal saadetud');
            } catch ( e ){
                callback('Katkestamisel tekkis viga: ' + e.message);
            }
        } else {
            callback('Protsessi ei leitud');
        }
    }
}
module.exports = new LocalExecutor();