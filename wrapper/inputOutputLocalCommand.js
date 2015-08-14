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
        var contentFile = session.requestFiles.content;

        fs.readFile(contentFile, 'utf-8', function (err, sourceText) {

            if(err){
                session.setErrors(err);
                return callback( err, session );
            }

            self.getCommandModel(session, function (err, model) {
                logger.debug('getCommandModel callback');
                if(err) return callback(err);

                localExecutor.execute( model, function ( err, response ) {

                    if(err) return callback(err);
                    logger.debug('Program is finished');

                    if(response.isSuccess){
                        session.message = Session.messages.OK;
                    } else {
                        session.setErrors(response.errors);
                    }

                    session.addOutputFile('output', {
                        type: 'output',
                        fileName: config.wrapper.id + '_output.' + FileUtil.getExtension( model.outputPaths.output ),
                        filePath: model.outputPaths.output,
                        contentType: mime.lookup(model.outputPaths.output)
                    });

                    return callback( err, session );
                });
            });
        });
    };

    this.getCommandModel = function (session, callback) {
        var model = new CommandModel();

        model.serviceProperties.commandTemplate = config.wrapper.command.commandTemplate;
        model.init( session );
        model.setKeyValue('data', session.getFile('content'));
        model.addOutputPath('output', {extension: 'txt'});
        model.render(function (err) {
            logger.debug('Render callback');
            callback(err, model);
        });
    }
}

module.exports = InputOutputLocalCommand;