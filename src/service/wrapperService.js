var logger = require('log4js').getLogger('wrapper_service');
var config = require('../../config');
var sessionService = require('./sessionService');
var Session = require('../model/session');

function WrapperService() {
    var self = this;

    this.execute = function(serviceRequest, callback) {

        self._initSession(serviceRequest, function (err, session) {

            if (session.isAsync == true) {
                self.getServiceResponse(session.id, callback);
            }

            var Processor = require(__base + '/wrapper/' + config.service.staticOptions.wrapper);
            var processor = new Processor();

            processor.process(serviceRequest, session, function ( error, session, finalPipecontent ) {

                sessionService.closeSession(session, finalPipecontent, function (err, session) {
                    logger.debug('Sessioon on lõpetanud ja savestatud');

                    if (session.isAsync == false) {
                        if (error) return callback(error);
                        self.getServiceResponse(session.id, callback);
                    }

                });
            });
        });
    };

    this._initSession = function(serviceRequest, callback){

        sessionService.getSession( serviceRequest.service.meta.sessionId, function(err, session){
            session.message = Session.messages.RUNNING;
            session.success = true;
            session.isAsync = serviceRequest.service.meta.isAsync;
            session.isFinished = false;
            sessionService.saveSession(session, function(){
                return callback(null, session);
            });
        });
    };

    this.getServiceResponse = function (instanceId, callback) {
        sessionService.getSession(instanceId, function (err, session) {
            sessionService.getApiResponse(session, callback);
        });
    };
}

module.exports = WrapperService;