/**
 * Created by priit on 17.06.15.
 */
var logger = require('log4js').getLogger('file_util');
var fs = require('fs');
var rimraf = require('rimraf');


var FileUtil = {

    mv: function(source, target, callback) {
        FileUtil.cp(source, target, function (err) {
            if(err) return callback(err);
            fs.unlink(source, callback);
        });
    },

    cp: function(source, target, callback) {
        var cbCalled = false;

        var rd = fs.createReadStream(source);
        rd.on("error", function(err) {
            done(err);
        });

        var wr = fs.createWriteStream(target);
        wr.on("error", function(err) {
            done(err);
        });
        wr.on("close", function(ex) {
            done();
        });

        rd.pipe(wr);

        function done(err) {
            if (!cbCalled) {
                callback(err);
                cbCalled = true;
            }
        }
    },

    rmdir: function(path, callback){
        return rimraf(path, callback);
    }
};

module.exports = FileUtil;