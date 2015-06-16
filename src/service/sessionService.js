var logger = require('log4js').getLogger('session_service');
var randomstring = require('randomstring');
var config = require('../../config');
var fs = require('fs');
var daoService = require('./daoService');
var Session = require('../model/session');

function SessionService() {

    var self = this;

    this.generateId = function () {
        return randomstring.generate(40);
    };

    this.getSession = function (sessionId, callback) {

        daoService.get(sessionId, function (err, session) {
            if(err) return callback(err);

            if (session == null) {
                session = new Session(sessionId);
            }
            callback(null, session);
        });
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

        self._removeStorage(self.getStorePath(sessionId), function () {
            logger.debug('Session file storage removed');
            daoService.delete(sessionId, function (err) {
                logger.debug('Session redis storage removed');
                callback(err);
            });
        })
    };

    this._removeStorage = function (path, callback) {

        var rmdirAsync = function (path, callback) {
            fs.readdir(path, function (err, files) {
                if (err) {
                    // Pass the error on to callback
                    callback(err, []);
                    return;
                }
                var wait = files.length,
                    count = 0,
                    folderDone = function (err) {
                        count++;
                        // If we cleaned out all the files, continue
                        if (count >= wait || err) {
                            fs.rmdir(path, callback);
                        }
                    };
                // Empty directory to bail early
                if (!wait) {
                    folderDone();
                    return;
                }

                // Remove one or more trailing slash to keep from doubling up
                path = path.replace(/\/+$/, "");
                files.forEach(function (file) {
                    var curPath = path + "/" + file;
                    fs.lstat(curPath, function (err, stats) {
                        if (err) {
                            callback(err, []);
                            return;
                        }
                        if (stats.isDirectory()) {
                            rmdirAsync(curPath, folderDone);
                        } else {
                            fs.unlink(curPath, folderDone);
                        }
                    });
                });
            });
        };

        rmdirAsync(path, callback);
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