var logger = require('log4js').getLogger('wrapper_service');
var config = require('../../config');
var sessionService = require('./sessionService');
var Session = require('../model/session');

function WrapperService() {
    var self = this;

    this.execute = function(serviceRequest, callback) {

        self._initSession(serviceRequest, function (err, session) {
            if(err) return callback(err);

            if (session.isAsync == true) {
                self.getServiceResponse(session.id, callback);
            }

            var Processor = require(__base + '/wrapper/' + config.service.staticOptions.wrapper);
            var processor = new Processor();

            processor.process(serviceRequest, session, function ( err, session, finalPipecontent ) {
                if(err) return callback(err);

                sessionService.closeSession(session, finalPipecontent, function (err, session) {
                    logger.debug('Sessioon on lõpetanud ja savestatud');
                    if (session.isAsync == false) {
                        logger.debug('Send response');
                        if(err) return callback(err);
                        self.getServiceResponse(session.id, callback);
                    }
                });
            });
        });
    };

    this._initSession = function(serviceRequest, callback){

        var session = sessionService.createSession();
        session.message = Session.messages.RUNNING;
        session.success = true;
        session.isAsync = serviceRequest.service.meta.isAsync;
        session.isFinished = false;
        sessionService.saveSession(session, function(err){
            if(err) return callback(err);
            return callback(null, session);
        });
    };

    this.getServiceResponse = function (instanceId, callback) {
        sessionService.getSession(instanceId, function (err, session) {
            if(err){
                return callback(err);
            }
            //logger.debug(session);
            sessionService.getApiResponse(session, callback);
        });
    };
}

module.exports = WrapperService;