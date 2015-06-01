/**
 * Created by priit on 29.05.15.
 *
 * STATIC class
 */

var randomstring = require('randomstring');
var config = require('../../config');
var fs = require('fs');
var daoService = require('./daoService');
var Session = require('../model/session');

function SessionService(){}

SessionService.prototype.generateId = function () {
    return randomstring.generate(40);
};

SessionService.prototype.getSession = function (sessionId, callback) {

    daoService.get(sessionId, function(session){
        if(session == null){
            session = new Session( sessionId );
        }
        callback(session);
    });
};

SessionService.prototype.getStorePath = function (sessionId) {
    return config.service.staticOptions.storagePath + '/' + sessionId;
};

SessionService.prototype.storeToFile = function (sessionId, value, callback) {

    var sessionPath =  this.getStorePath(sessionId);

    var writeFile = function(){
        var name = randomstring.generate(10);
        var filePath = sessionPath +'/'+ name;
        fs.writeFile( filePath, value, function (err) {
            if (err){
                console.log(err);
                throw new Error('File write failed');
            }
            console.log('File is written');
            callback( filePath );
        });
    };

    this.checkSessionDir(sessionId, writeFile);
};

SessionService.prototype.getSessionOutputPath = function (session) {

    if(session.outputPath == null) {
        session.outputPath = this.getStorePath(session.id) + '/' + randomstring.generate(10);
    }
    return session.outputPath;
};

SessionService.prototype.checkSessionDir = function(sessionId, callback){

    var storePath = this.getStorePath(sessionId);

    fs.exists(storePath, function(exists) {
        if (exists) {
            callback();
        } else {
            fs.mkdir(storePath, function (err) {
                if (err){
                    console.log(err);
                    throw new Error('Dir creation failed failed');
                }
                callback();
            });
        }
    });
};

SessionService.prototype.removeSession = function(sessionId, callback){

    this._removeStorage( this.getStorePath(sessionId), function(){
        console.log('Session file storage removed');
        daoService.delete(sessionId, function(){
            console.log('Session redis storage removed');
            callback();
        });
    })
};

SessionService.prototype._removeStorage = function(path, callback) {

    var rmdirAsync = function (path, callback) {
        fs.readdir(path, function(err, files) {
            if(err) {
                // Pass the error on to callback
                callback(err, []);
                return;
            }
            var wait = files.length,
                count = 0,
                folderDone = function(err) {
                    count++;
                    // If we cleaned out all the files, continue
                    if( count >= wait || err) {
                        fs.rmdir(path,callback);
                    }
                };
            // Empty directory to bail early
            if(!wait) {
                folderDone();
                return;
            }

            // Remove one or more trailing slash to keep from doubling up
            path = path.replace(/\/+$/,"");
            files.forEach(function(file) {
                var curPath = path + "/" + file;
                fs.lstat(curPath, function(err, stats) {
                    if( err ) {
                        callback(err, []);
                        return;
                    }
                    if( stats.isDirectory() ) {
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

SessionService.prototype.saveSession = function (session, callback) {
    daoService.set(session.id, session, callback);
};

SessionService.prototype.getApiResponse = function( session, callback ){
    var self = this;
    this._getApiResponseItem(session, function (dataItem) {
        if(session.message == Session.messages.OK || session.message == Session.messages.ERROR){
            self.removeSession(session.id, function(){
                console.log('Session and its contents are removed!');
            });
        }
        callback(dataItem);
    });
};

SessionService.prototype._getApiResponseItem = function( session, callback ){

    var response = {};

    if(session.id){
        response.serviceId = session.id;
    }

    response.success = session.success;
    response.message = session.message;
    response.recheckInterval = session.recheckInterval;

    if(session.message != Session.messages.OK){
        callback( {response: response} );
        return;
    }

    response.contentType = session.contentType;

    if( session.outputPath ){
        response.data = fs.readFile(session.outputPath, 'utf8', function (err, data) {
            if(err){
                response.data = err;
            } else {
                response.data = data;
            }
            callback( {response: response} );
        });
    } else {
        response.data = session.data;
        response.contentType = session.contentType;
        callback( {response: response} );
    }
};

module.exports = new SessionService();