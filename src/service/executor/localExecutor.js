var logger = require('log4js').getLogger('local_executor');
var config = require('../../../config');
var sessionService = require('../../service/sessionService');
var Session = require('../../model/session');
var LocalCommand = require('../../mapper/localCommand');

var fs = require('fs');

function LocalExecutor() {
    var self = this;

    this.execute = function (commandModel, callback) {

        var response = {
            message: null,
            success:true,
            stdOutPath: sessionService.getNewSessionFilePath(commandModel.session),
            outputPaths: commandModel.outputPaths
        };

        var localCommand = new LocalCommand(commandModel);
        localCommand.generateLocalCommand();
        self._executeLocalCommand(localCommand, response, callback);
    };

    this._executeLocalCommand = function (localCommand, response, callback) {

        var spawn = require('child_process').spawn;
        var command = localCommand.command;
        var commandParams = localCommand.commandParams;

        logger.debug(localCommand.command);
        logger.debug(localCommand.commandParams);
        logger.debug(response);

        var process = spawn(command, commandParams);
        self._run(response, process, callback);
    };

    this._run = function (response, process, callback) {

        var outputStream = fs.createWriteStream(response.stdOutPath, {flags: 'a'});
        process.stdout.pipe(outputStream);
        process.stderr.pipe(outputStream);

        process.stderr.on('data', function (data) {
            logger.error('Got error: ' + data);
            response.success = false;
        });

        process.on('close', function (code, signal) {
            logger.debug('child process terminated due to receipt of signal: ' + signal + ' code: ' + code);
            callback(null, response);
        });
    };
}
module.exports = LocalExecutor;