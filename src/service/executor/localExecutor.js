var logger = require('log4js').getLogger('local_executor');
var sessionService = require('../../service/sessionService');
var LocalCommand = require('../../mapper/localCommand');
var spawn = require('child_process').spawn;
var fs = require('fs');

function LocalExecutor() {
    var self = this;

    this.execute = function (commandModel, callback) {

        var response = {
            isSuccess:true,
            stdOutPath: sessionService.getNewSessionFilePath(commandModel.session, {extension: commandModel.stdOutExtension}),
            errors: []
        };

        var localCommand = new LocalCommand(commandModel).generate();
        self._executeLocalCommand(localCommand, response, callback);
    };

    this._executeLocalCommand = function (localCommand, response, callback) {

        var command = localCommand.command;
        var commandParams = localCommand.commandParams;

        logger.debug(localCommand.command);
        logger.debug(localCommand.commandParams);
        logger.debug(response);

        try {
            var process = spawn(command, commandParams);
            self._run(response, process, callback);
        } catch (e) {
            logger.error(e);
            callback(e.message);
        }
    };

    this._run = function (response, process, callback) {

        var outputStream = fs.createWriteStream(response.stdOutPath, {flags: 'a'});
        process.stdout.pipe(outputStream);
        process.stderr.pipe(outputStream);

        process.stderr.on('data', function (data) {
            logger.error('Got error: ' + data);
            response.isSuccess = false;
            response.errors.push({util:data.toString()});
        });

        process.on('error', function (data) {
            logger.error('Got error: ' + data);
            response.isSuccess = false;
            response.errors.push({util:data.toString()});
        });

        process.on('close', function (code, signal) {
            logger.debug('child process terminated due to receipt of signal: ' + signal + ' code: ' + code);
            callback(null, response);
        });
    };
}
module.exports = new LocalExecutor();