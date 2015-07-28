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
                logger.debug('Session not found: ' + sessionId);
                return callback('Sessiooni ei leitud');
            }
            callback(null, session);
        });
    };

    this.createSession = function (serviceRequest, cb) {
        var sessionId = self.generateId();
        var session = new Session(sessionId);
        session.message = Session.messages.RUNNING;
        session.success = true;
        session.requestBody = serviceRequest.data;
        session.requestFiles = {};
        session.isAsync = serviceRequest.data.is_async;
        session.isFinished = false;
        self.saveSession(session, function(err){
            if(err) return cb(err);
            self.checkSessionDir(sessionId, function (err) {
                if(err) return cb(err);
                self._storeRequestFiles(session, serviceRequest.files, function (err, session) {
                    return cb(err, session);
                });
            });
        });
    };

    this._storeRequestFiles = function (session, files, cb) {

        var tmpList = [];
        for(var i in files){
            tmpList.push(files[i]);
        }

        if(tmpList.length > 0){
            self._storeOnIndex(session, tmpList, 0, cb)
        }
    };

    this._storeOnIndex = function (session, tmpList, index, cb) {

        var tmpFile = tmpList[index];
        var sessionFilePath = this.getNewFilePath(session.id);

        FileUtil.mv(tmpFile.path, sessionFilePath, function(err){
           if(err) return cb(err);
            session.requestFiles[tmpFile.fieldname] = sessionFilePath;

            if(index < tmpList - 1){
                index = index + 1;
                self._storeOnIndex(session, tmpList, 0, cb)
            } else {
                cb(null, session);
            }
        });
    };

    this.getStorePath = function (sessionId) {
        return config.service.staticParams.storagePath + '/' + sessionId;
    };

    this.getNewFilePath = function (sessionId) {
        var sessionPath = self.getStorePath(sessionId);
        return sessionPath + '/' + randomstring.generate(10);
    };


    this.storeToFile = function (sessionId, value, callback) {

        var writeFile = function () {
            var filePath = self.getNewFilePath(sessionId);
            fs.writeFile(filePath, value, function (err) {
                if (err) {
                    logger.error(err);
                    return callback('File write failed');
                }
                logger.debug('File is written');
                callback(null, filePath);
            });
        };

        self.checkSessionDir(sessionId, writeFile);
    };

    this.closeSession = function (session, callback) {
        session.isFinished = true;
        self.saveSession(session, callback);
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
            logger.debug('Session file storage removed: ' + sessionId);
            daoService.delete(sessionId, function (err) {
                logger.debug('Session redis storage removed: ' + sessionId);
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

        if(session.errors != null){
            response.errors = session.errors;
        }

        if (session.message == Session.messages.RUNNING) {
            response.recheckInterval = session.recheckInterval;
        }

        if (session.message != Session.messages.OK) {
            return callback(null, {response: response});
        }

        response.data = {};

        if(session.data){
            response.data = session.data;
        }

        var filesList = [];
        for(var i in session.outputFiles){
            filesList.push({
                key: 'output',
                fileName: session.outputFiles[i].fileName,
                contentType: session.outputFiles[i].contentType
            });
        }
        response.data.files = filesList;

        return callback(null, {response: response});
    };
}

module.exports = new SessionService();