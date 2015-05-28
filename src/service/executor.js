/**
 * Created by priit on 26.05.15.
 */

var sessions = require(__base + 'src/service/executor/sessions').Sessions;

var Executor = function(){

    var self = this;

    this.execute = function(param, cb){

        var runningCommand = self.runCommand();

        var sessionItem = {};
        sessionItem.command = runningCommand;

        var session = sessions.set(sessionItem);
        //console.log(param);
        cb(param);
    };

    this.runCommand = function(){

        var spawn = require('child_process').spawn,
            pwd  = spawn('tail', ['-f','test.txt']);

        pwd.on('message', function (data) {
            console.log('message');
            console.log(data);
        });

        pwd.stdout.on('data', function (data) {
            console.log('data');
            console.log(data.toString());
        });

        pwd.stderr.on('data', function (data) {
            console.log('data err');
            console.log(data.toString());
        });

        pwd.on('close', function (code, signal) {
            console.log('child process terminated due to receipt of signal '+signal);
            console.log(code);
        });

        // send SIGHUP to process
        //pwd.kill('SIGHUP');
        return pwd;
    };
};

module.exports.Executor = Executor;