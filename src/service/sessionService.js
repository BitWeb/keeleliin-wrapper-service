var logger = require('log4js').getLogger('session_service');
var randomstring = require('randomstring');
var config = require('../../config');
var fs = require('fs');
var daoService = require('./daoService');
var Session = require('../model/session');
var FileUtil = require('../util/file');

function SessionService() {

    var self = this;

    this.generateId = function () {
        return randomstring.generate(40);
    };

    this.getSession = function (sessionId, callback) {

        daoService.get(sessionId, function (err, session) {
            if(err) return callback(err);
            if(session == null){
                return callback({session: 'Sessiooni ei leitud'});
            }
            callback(null, session);
        });
    };

    this.createSession = function () {
        var sessionId = self.generateId();
        return new Session(sessionId);
    };

    this.getStorePath = function (sessionId) {
        return config.service.staticOptions.storagePath + '/' + sessionId;
    };

    this.storeToFile = function (sessionId, value, callback) {

        var sessionPath = self.getStorePath(sessionId);

        var writeFile = function () {
            var name = randomstring.generate(10);
            var filePath = sessionPath + '/' + name;
            fs.writeFile(filePath, value, function (err) {
                if (err) {
                    logger.error(err);
                    throw new Error('File write failed');
                }
                logger.debug('File is written');
                callback(null, filePath);
            });
        };

        self.checkSessionDir(sessionId, writeFile);
    };

    this.closeSession = function (session, output, callback) {

        session.isFinished = true;

        self.storeToFile(session.id, JSON.stringify( output ), function (err, path) {
            if(err) return callback(err);
            session.outputPath = path;
            self.saveSession(session, callback);
        });
    };

    this.getNewSessionFilePath = function (session) {
        return self.getStorePath(session.id) + '/' + randomstring.generate(10);
    };

    this.checkSessionDir = function (sessionId, callback) {

        var storePath = self.getStorePath(sessionId);

        fs.exists(storePath, function (exists) {
            if (exists) {
                callback();
            } else {
                fs.mkdir(storePath, function (err) {
                    if (err) {
                        logger.error(err);
                        throw new Error('Dir creation failed failed');
                    }
                    callback();
                });
            }
        });
    };

    this.removeSession = function (sessionId, callback) {

        FileUtil.rmdir(self.getStorePath(sessionId), function () {
            logger.debug('Session file storage removed');
            daoService.delete(sessionId, function (err) {
                logger.debug('Session redis storage removed');
                callback(err);
            });
        })
    };

    this.saveSession = function (session, callback) {
        daoService.set(session.id, session, function (err) {
            callback(err, session);
        });
    };

    this.getApiResponse = function (session, callback) {

        self._getApiResponseItem(session, function (err, dataItem) {
            if (session.message == Session.messages.OK || session.message == Session.messages.ERROR) {
                self.removeSession(session.id, function () {
                    logger.debug('Session and its contents are removed!');
                });
            }
            callback(null, dataItem);
        });
    };

    this._getApiResponseItem = function (session, callback) {

        var response = {};

        if (session.id) {
            response.serviceId = session.id;
        }

        response.success = session.success;
        response.message = session.message;

        if (session.message == Session.messages.RUNNING) {
            response.recheckInterval = session.recheckInterval;
        }

        if (session.message != Session.messages.OK) {
            callback(null, {response: response});
            return;
        }

        if (session.outputPath) {
            fs.readFile(session.outputPath, 'utf8', function (err, data) {
                // new Buffer(err).toString('base64')

                if (err) {
                    response.pipecontent = err;
                } else {
                    response.pipecontent = JSON.parse(data);
                }
                callback(null, {response: response});
            });
        } else {
            response.pipecontent = session.data;
            callback(null, {response: response});
        }
    };
}

module.exports = new SessionService();