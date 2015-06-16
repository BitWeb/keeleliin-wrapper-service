var logger = require('log4js').getLogger('wrapper');
var config = require('./../config');
var executorService = require('./../src/service/executorService');
var Session = require('../src/model/session');
var CommandModel = require('../src/mapper/commandModel');
var fs = require('fs');

function ContentTokenizer(){

    var self = this;

    this.process = function (requestBody, session, callback) {

        var pipeContent = requestBody.service.pipecontent;
        var sourceText = new Buffer(pipeContent.content, 'base64').toString();

        self.getCommandModel(session, sourceText, function (err, model) {

            executorService.execute( model, function ( error, response ) {
                /*  response = { isSuccess: BOOLEAN, stdOutPath: STRING, outputPaths:  { key: value, ...} } */
                logger.debug('Väline programm on lõpetanud');

                fs.readFile(response.outputPaths.outputPath, function (err, output) {
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
                            location: {
                                start: stringStart,
                                end: globalStart
                            }
                        };
                        tokens.push(token);
                    }

                    requestBody.service.pipecontent.tokens = tokens;

                    var finalPipecontent = requestBody.service.pipecontent;
                    session.message = Session.messages.OK;

                    logger.debug('Pipecontenti mappimine on lõpetatud');

                    return callback(null, session, finalPipecontent);
                });

            });

        });
    };

    this.getCommandModel = function (session, sourceText, callback) {

        var model = new CommandModel();
        model.init( session );
        model.setFileValue('data', sourceText);
        model.setOutputPath('outputPath');
        model.render(function (err) {
            callback(err, model);
        });
    }
}

module.exports = ContentTokenizer;