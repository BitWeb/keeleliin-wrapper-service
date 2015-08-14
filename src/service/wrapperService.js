var logger = require('log4js').getLogger('wrapper_service');
var config = require('../../config');
var Processor = require(__base + '/wrapper/' + config.wrapper.class);
var sessionService = require('./sessionService');

function WrapperService() {
    var self = this;

    this.execute = function(serviceRequest, callback) {

        sessionService.createSession(serviceRequest, function (err, session) {
            if(err) return callback(err);

            if (session.isAsync == true) {
                self.getServiceResponse(session.id, callback);
            }

            var processor = new Processor();

            processor.process( session, function ( err, session ) {
                if(err) return callback(err);

                sessionService.closeSession(session, function (err, session) {
                    logger.debug('Sessioon on lõpetanud ja savestatud. isAsync:' + session.isAsync);
                    if (session.isAsync == false) {
                        logger.debug('Send response');
                        if(err) return callback(err);
                        self.getServiceResponse(session.id, callback);
                    }
                });
            });
        });
    };

    this.getServiceResponse = function (sessionId, callback) {
        sessionService.getSession(sessionId, function (err, session) {
            if(err){
                return callback(err);
            }
            logger.debug(session);
            sessionService.getApiResponse(session, callback);
        });
    };

    this.getServiceFile = function (sessionId, fileId, callback) {
        sessionService.getSession(sessionId, function (err, session) {
            if(err){
                return callback(err);
            }

            var outputFile = session.outputFiles[fileId];

            if(!outputFile){
                return callback('Dokumenti ei leitud');
            }

            callback(null, outputFile);
        });
    };

    this.kill = function ( sessionId , callback) {

        var mapResponse = function (err, message) {
            var data = {};
            data.sessionId = sessionId;
            if(err){
                data.success = false;
                data.message = err;
            } else {
                data.success = true;
                data.message = message;
            }

            var response = {
                response: data
            };

            return response;
        };

        sessionService.getSession(sessionId, function (err, session) {
            if(err){
                return callback(err);
            }
            var processor = new Processor();
            if(processor.kill != undefined){
                processor.kill( session, function (err, response) {
                    callback(null, mapResponse(err, response));
                });
            } else {
                callback(null, mapResponse('Teenusele ei ole katkestamise meetodit implementeeritud'));
            }
        });
    };
}

module.exports = new WrapperService();