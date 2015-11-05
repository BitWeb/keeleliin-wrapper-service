var logger = require('log4js').getLogger('wrapper');
var config = require('./../config');
var localExecutor = require('./../src/service/executor/localExecutor');
var Session = require('../src/model/session');
var CommandModel = require('../src/mapper/commandModel');
var fs = require('fs');
var mime = require('mime');
var path = require('path');
var FileUtil = require('./../src/util/file');

function InputOutputLocalCommand(){

    var self = this;

    this.process = function ( session, callback) {

        self._getCommandModel(session, function (err, model) {
            logger.debug('getCommandModel callback');
            if(err) return callback(err);

            localExecutor.execute( model, session, function ( err, response ) {

                if(err) return callback(err);
                logger.debug('Program is finished');

                if(response.isSuccess){
                    session.message = Session.messages.OK;
                } else {
                    session.setErrors(response.errors);
                }

                var outputType = config.wrapper.outputTypes.pop();

                session.addOutputFile('id_x', {
                    key : outputType.key,
                    type: outputType.type,
                    fileName: config.wrapper.id + '_output.' + FileUtil.getExtension( model.outputPaths.output ),
                    filePath: model.outputPaths.output,
                    contentType: mime.lookup(model.outputPaths.output)
                });

                return callback( err, session );
            });
        });

    };

    this._getCommandModel = function (session, callback) {
        var model = new CommandModel();

        model.serviceProperties.commandTemplate = config.wrapper.command.commandTemplate;
        model.init( session );
        model.setKeyValue('data', session.getRequestFile('content'));
        model.addOutputPath('output', {extension: 'txt'});
        model.render(function (err) {
            logger.debug('Render callback');
            callback(err, model);
        });
    };

    this.kill = localExecutor.kill;
}

module.exports = InputOutputLocalCommand;