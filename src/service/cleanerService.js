/**
 * Created by priit on 29.06.15.
 */
var logger = require('log4js').getLogger('cleaner_service');
var schedule = require('node-schedule');
var config = require('./../../config');
var sessionService = require('./sessionService');
var fs = require('fs');

var CleanerService = function () {

    var self = this;

    this.init = function(){
        logger.debug('init');

        if(!config.wrapper.requestConf.staticParams.sessionMaxLifetime){
            return;
        }

        schedule.scheduleJob('0 0 * * *', function(){
            self.cleanSystem();
        });
        self.cleanSystem();
    };

    this.cleanSystem = function () {

        var folder = config.fs.storagePath;

        fs.readdir(folder, function(err, files) {
            console.log('readFolder');

            if(files != undefined && files.length > 0){
                self.checkOnIndex(0, files, folder, function (err) {
                    if(err){
                        return logger.error(err);
                    }
                    return logger.info('Cleaned');
                });
            } else {
                return logger.info('Cleaned');
            }
        });
    };

    this.checkOnIndex = function(index, files,folder, cb){

        if(index >= files.length){
            return cb();
        }

        var file = files[index];

        var continueScan = function () {
            index = index +1;
            self.checkOnIndex(index, files,folder, cb);
        };

        if (file[0] !== '.') {
            var filePath = folder + '/' + file;
            logger.debug(filePath);
            fs.stat(filePath, function(err, stat) {
                if(err){
                    logger.error(filePath, err);
                    return continueScan();
                }

                if(stat == undefined){
                    logger.error('Stat is undefined for: ' + filePath);
                    return continueScan();
                }

                if (stat.isDirectory()) {
                    var timeModified = stat.mtime.getTime();
                    var currentTime = new Date().getTime();

                    if(currentTime - timeModified > ( config.wrapper.requestConf.staticParams.sessionMaxLifetime * 1000 )){
                        sessionService.removeSession(file, function (err) {
                            if(err){
                                logger.error('Session delete failed: ' + file);
                            } else {
                                logger.debug('Session delete success: ' + file);
                            }
                            return continueScan();
                        });
                    } else {
                        return continueScan();
                    }
                } else {
                    return continueScan();
                }
            });
        }
    }
};


module.exports = new CleanerService();