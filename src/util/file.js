/**
 * Created by priit on 17.06.15.
 */
var fs = require('fs');

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
    }
};

module.exports = FileUtil;