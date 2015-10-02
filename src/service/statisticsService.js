/**
 * Created by priit on 2.10.15.
 */
var logger = require('log4js').getLogger('statistics_service');
var async = require('async');
var os = require('os');
var njds = require('nodejs-disks');

function StatisticsService() {
    var self = this;

    this.getServerStatistics = function(req, cb) {

        var summary = {};

        async.waterfall([
                function (callback) {
                    self.getMemoryStatistics(function (err, data) {
                        summary.memory = data;
                        callback();
                    });
                },
                function (callback) {
                    self.getDrivesStatistics(function (err, drives) {
                        summary.drives = drives;
                        callback();
                    });
                },
                function (callback) {
                    self.getCPULoad(function (err, data) {
                        summary.load = data;
                        callback();
                    });
                }
            ],
            function (err) {
                cb(err, summary);
            }
        );
    };


    this.getMemoryStatistics = function (callback) {

        var total = Math.round( os.totalmem() / 10737418,24 ) / 100;
        var used = Math.round( (os.totalmem() - os.freemem()) / 10737418,24 ) / 100;
        var systemMemory = {
            total: total + ' GB',
            used: used + ' GB'
        };
        callback( null, systemMemory);
    };


    this.getDrivesStatistics = function ( callback ) {
        var drivesSummary = [];
        njds.drives( function (err, drives) {
                njds.drivesDetail(
                    drives,
                    function (err, data) {
                        for(var i in data) {

                            var drive = {
                                name: data[i].drive,
                                total: data[i].total,
                                used: data[i].used
                            };
                            drivesSummary.push(drive);
                        }
                        callback(null, drivesSummary);
                    }
                );
            }
        )
    };

    this.getCPULoad = function (callback) {
        var loads = os.loadavg();
        for(i in loads){
            var load = loads[i];
            loads[i] = Math.round(load * 100) / 100;
        }
        loads.push( os.cpus().length );
        callback( null, loads);
    }
}

module.exports = new StatisticsService();