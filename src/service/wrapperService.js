var logger = require('log4js').getLogger('wrapper_service');
var config = require('../../config');
var Processor = require(__base + '/wrapper/' + config.service.staticParams.wrapper);
var sessionService = require('./sessionService');
var Session = require('../model/session');

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
}

module.exports = new WrapperService();