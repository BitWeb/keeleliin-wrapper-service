var logger = require('log4js').getLogger('wrapper');
var config = require('./../config');
var localExecutor = require('./../src/service/executor/localExecutor');
var Session = require('../src/model/session');
var CommandModel = require('../src/mapper/commandModel');
var fs = require('fs');
var mime = require('mime');
var path = require('path');

function Morfyhestaja(){

    var self = this;

    this.process = function ( session, callback) {

        self.getCommandModel(session, function (err, model) {
            logger.debug('GetCommandModel callback');
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
                    fileName: path.basename(response.stdOutPath),
                    filePath: response.stdOutPath,
                    contentType: mime.lookup(response.stdOutPath)
                });

                return callback( err, session );
            });
        });
    };

    this.getCommandModel = function (session, callback) {
        var model = new CommandModel();
        model.serviceProperties.commandTemplate = config.availableWappers.MORFANALYZER.commandTemplate;
        model.init( session );
        model.setTextValue('data', session.requestFiles.content);
        model.render(function (err) {
            logger.debug('Render callback');
            callback(err, model);
        });
    }
}

module.exports = Morfyhestaja;