/**
 * Created by priit on 29.05.15.
 *
 * STATIC class
 */

var randomstring = require('randomstring');
var config = require('../../config');
var fs = require('fs');
var daoService = require('./daoService');

function Session(){}

Session.prototype.generateId = function () {
    return randomstring.generate(40);
};

Session.prototype.getStorePath = function (sessionId) {
    return config.service.staticOptions.storagePath + '/' + sessionId;
};

Session.prototype.storeToFile = function (sessionId, value, callback) {

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

Session.prototype.checkSessionDir = function(sessionId, callback){

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

Session.prototype.removeSession = function(sessionId, callback){

    this.removeStorage( this.getStorePath(sessionId), function(){
        console.log('Session file storage removed');
        daoService.delete(sessionId, function(){
            console.log('Session redis storage removed');
            callback();
        });
    })
};

Session.prototype.removeStorage = function(path, callback) {
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

module.exports = new Session();