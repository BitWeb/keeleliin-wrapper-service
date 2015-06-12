var logger = require('log4js').getLogger('wrapper');
var config = require('./../config');
var executorService = require('./../src/service/executorService');
var sessionService = require('../src/service/sessionService');
var Session = require('../src/model/session');
var CommandModel = require('../src/mapper/commandModel');
var fs = require('fs');

function Processor(){

    var self = this;

    this.process = function (requestBody, session, callback) {

        var pipeContent = requestBody.service.pipecontent;

        var sourceText = pipeContent.content;

        self.getCommandModel(session, sourceText, function (err, model) {

            //kasuta executor servicet ja saa selle väljund
            executorService.execute( model, function ( error, response ) {
                /*  response = { isSuccess: BOOLEAN, stdOutPath: STRING, outputPaths:  { key: value, ...} } */



                fs.readFile(response.outputPaths.outputPath, function (err, output) {
                    var wrapperOutput = output.toString();
                    var outputStrings = wrapperOutput.split("\n");
                    var tokens = [];
                    for(i in outputStrings){
                        var string = outputStrings[i];
                        var start = sourceText.search(string);
                        var token = {
                            idx: i,
                            position: {
                                start: start,
                                end: start + string.length
                            }
                        };
                        tokens.push(token);
                    }

                    requestBody.service.pipecontent.tokens = tokens;

                    var finalPipecontent = requestBody.service.pipecontent;
                    session.message = Session.messages.OK;
                    sessionService.closeSession(session, finalPipecontent, function (err, session) {
                        return callback();
                    });
                });

            });

        });
    };

    this.getCommandModel = function (session,sourceText, callback) {

        var model = new CommandModel();
        model.init( session );
        model.setFileValue('data', sourceText);
        model.setOutputPath('outputPath');
        model.render(function (err) {
            callback(err, model);
        });
    }
}

module.exports = Processor;