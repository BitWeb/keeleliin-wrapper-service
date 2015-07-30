var logger = require('log4js').getLogger('wrapper');
var config = require('./../config');
var localExecutor = require('./../src/service/executor/localExecutor');
var Session = require('../src/model/session');
var SessionService = require('./../src/service/sessionService');
var async = require('async');
var CommandModel = require('../src/mapper/commandModel');
var fs = require('fs');
var mime = require('mime');
var path = require('path');

function Tokenizer(){

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

                    if(err){
                        session.setErrors(err);
                        return callback( err, session );
                    }
                    if(!response.isSuccess){
                        session.setErrors(response.errors);
                        return callback( err, session );
                    }

                    fs.readFile(model.outputPaths.outputPath1, function (err, output) {
                        if(err) return callback(err);

                        var wrapperOutput = output.toString();
                        var outputStrings = wrapperOutput.split("\n");
                        var tokens = [];

                        var globalStart = 0;

                        for(i in outputStrings){
                            var string = outputStrings[i];

                            var start = sourceText.indexOf(string);
                            var stringStart = globalStart + start;
                            var stringLength = string.length;

                            sourceText = sourceText.slice(start + stringLength); //eemaldan lähteteksti alguse, et korduvad sõnad ei jääks sama asukohaga

                            globalStart = stringStart + stringLength;

                            var token = {
                                idx: i,
                                location: [stringStart, globalStart ]
                            };
                            tokens.push(token);
                        }

                        session.message = Session.messages.OK;

                        var mapping = JSON.stringify(tokens);
                        logger.debug('Failide mappimine on lõpetatud');

                        session.addOutputFile('output', {
                            type: 'output',
                            fileName: path.basename(model.outputPaths.outputPath1),
                            filePath: model.outputPaths.outputPath1,
                            contentType: mime.lookup(model.outputPaths.outputPath1)
                        });

                        SessionService.storeToFile(session.id, mapping, { extension:'txt' }, function (error, mappingPath) {
                            session.addOutputFile('mapping',  {
                                type: 'mapping',
                                fileName: path.basename(mappingPath),
                                filePath: mappingPath,
                                contentType: mime.lookup(mappingPath)
                            });

                            return callback( error, session );
                        });

                    });

                });

            });

        });
    };

    this.getCommandModel = function (session, callback) {
        var model = new CommandModel();

        logger.error('commandTemplate');
        logger.error(config.wrapper);

        model.serviceProperties.commandTemplate = config.wrapper.command.commandTemplate;
        model.init( session );
        model.setTextValue('data', session.requestFiles.content);
        model.addOutputPath('outputPath1', {extension: 'txt'});
        model.render(function (err) {
            logger.debug('Render callback');
            callback(err, model);
        });
    }
}

module.exports = Tokenizer;