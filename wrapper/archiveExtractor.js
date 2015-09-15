var fs = require('fs');
var unzip = require('unzip');
var mkdirp = require('mkdirp');
var path = require('path');
var SessionService = require('./../src/service/sessionService');
var Session = require('../src/model/session');
var randomstring = require('randomstring');
var logger = require('log4js').getLogger('wrapper');
var mime = require('mime');
var isZip = require('is-zip');
var isGzip = require('is-gzip');
var isTar = require('is-tar');
var zlib = require('zlib');
var tar = require('tar');
var recursiveReaddir = require('recursive-readdir');
var isTextOrBinary = require('istextorbinary');

function ArchiveExtractor() {
    var self = this;

    this.process = function(session, callback) {
        var zipFile = session.requestFiles.content;
        var read = fs.readFileSync(zipFile);
        var zip = isZip(read);
        var gzip = isTar(read);

        if (isZip(read)) {
            return self._extractZipFile(zipFile, session, callback);
        } else if (isGzip(read)) {
            return self._extractGzipFile(zipFile, session, callback);
        } else if (isTar(read)) {
            return self._extractTarFile(zipFile, session, callback);
        } else {
            session.message = Session.messages.ERROR;
            return callback('Not supported archive file format.', session);
        }
    };

    this._extractZipFile = function(file, session, callback) {
        var count = 0;
        var isClosed = false;

        logger.debug('Extracting *.zip file');

        var checkForCallback = function () {

            logger.debug('Check for callback. count:' + count + ' isClosed: ' + isClosed);

            if (count == 0 && isClosed == true) {
                session.message = Session.messages.OK;
                return callback(null, session);
            }
        };

        fs.createReadStream(file).on('error', function(error) {
            session.setErrors(error);
            return callback(error, session);
        })
            .pipe(unzip.Parse())
            .on('entry', function(entry) {
                count++;
                var isFile = ('File' == entry.type);

                var savePath = SessionService.getStorePath(session.id);
                var fullpath = path.join(savePath, entry.path);
                logger.debug('Fullpath: ' + fullpath);
                var directory = (isFile ? path.dirname(fullpath) : fullpath);


                logger.debug('Countx: ' + count);

                mkdirp(directory, function(err) {
                    if (err) {
                        logger.error(err);
                        session.setErrors(err);
                        return callback(err, session);
                    }

                    if (isFile && isTextOrBinary.isTextSync(entry.path)) {
                        var uniqid = randomstring.generate(10);
                        var filePath = path.join(directory, uniqid);
                        logger.debug('Filepath: ' + filePath);
                        entry.pipe(fs.createWriteStream(filePath)).on('close', function() {
                            session.addOutputFile(uniqid, {
                                type: 'output',
                                filePath: filePath,
                                fileName: entry.path,
                                contentType: mime.lookup(fullpath) // getting the original file mime type
                            });
                            count = count - 1;
                            logger.debug('Close write on count: ' + count);
                            checkForCallback();
                        });
                    } else {
                        logger.debug('Not file and not text or binary on count: ' + count);
                        count = count - 1;
                        checkForCallback();
                        entry.autodrain();
                    }
                });
            })
            .on('close', function() {
                logger.debug('Close count: ' + count);
                isClosed = true;
                checkForCallback();
            });
    };






    this._extractGzipFile = function(file, session, callback) {

        logger.debug('Extracting *.tar.gz file');

        var savePath = SessionService.getStorePath(session.id);
        fs.createReadStream(file).pipe(zlib.Unzip())
            .pipe(tar.Extract({
                path: savePath
            })).on('end', function() {
                recursiveReaddir(savePath, [file], function(err, files) {
                    if (err) {
                        session.setErrors(err);
                        return callback(err, session);
                    }
                    for (var i = 0; i < files.length; i++) {
                        var uniqid = randomstring.generate(10);
                        var filePath = files[i];
                        var fileName = files[i].substring(filePath.indexOf(session.id) + session.id.length + 1);
                        session.addOutputFile(uniqid, {
                            type: 'output',
                            filePath: filePath,
                            fileName: fileName,
                            contentType: mime.lookup(filePath) // getting the original file mime type
                        });
                    }
                    session.message = Session.messages.OK;
                    return callback(null, session);
                });
            });
    };

    this._extractTarFile = function(file, session, callback) {

        logger.debug('Extracting *.tar file');

        var savePath = SessionService.getStorePath(session.id);
        fs.createReadStream(file)
            .pipe(tar.Extract({
                path: savePath
            })).on('end', function() {
                recursiveReaddir(savePath, [file], function(err, files) {
                    if (err) {
                        session.setErrors(err);
                        return callback(err, session);
                    }
                    for (var i = 0; i < files.length; i++) {
                        var uniqid = randomstring.generate(10);
                        var filePath = files[i];
                        var fileName = files[i].substring(filePath.indexOf(session.id) + session.id.length + 1);
                        session.addOutputFile(uniqid, {
                            type: 'output',
                            filePath: filePath,
                            fileName: fileName,
                            contentType: mime.lookup(filePath) // getting the original file mime type
                        });
                    }
                    session.message = Session.messages.OK;
                    return callback(null, session);
                });
            });
    };

    this.kill = function (session, callback) {
        logger.debug('Kill system process');
        callback(null, 'Katkestamise signaal saadetud');
    };
}

module.exports = ArchiveExtractor;