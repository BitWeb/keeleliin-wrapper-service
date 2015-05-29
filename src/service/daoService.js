/**
 * Created by priit on 28.05.15.
 *
 * Store and retrive objects
 *
 * Singelton
 */

var redis = require('redis');
redis.debug_mode = true;

var config = require(__base + 'config');

var DaoService = function(){
    var self = this;
    var connected = false;

    this.client = redis.createClient(config.redis.port, config.redis.host, {});

    this.client.on('connect', function() {
        console.log('connected');
        self.connected = true;
    });

    this.client.on("error", function (err) {
        console.log("Redis Error " + err);
    });

    this.set =  function(key, value, cb){

        self.client.hmset(key, value, function (err, reply) {
            console.log(key + ' is set');
            console.log(err);
            console.log(reply);

            if(cb != undefined){
                cb();
            }
        });
    };

    this.get = function(key, cb){

        self.client.hgetall(key, function(err, reply) {
            console.log(reply);
            if(cb != undefined){
                cb(reply);
            }
        });
    };

    this.delete = function(key, cb){

        self.client.del('frameworks', function(err, reply) {
            console.log(reply);
            if(cb != undefined){
                cb();
            }
        });
    };

    this.exists = function(key, cb){

        self.client.exists(key, function(err, reply) {
            if (reply === 1) {
                console.log('exists');
            } else {
                console.log('doesn\'t exist');
            }

            cb(reply);
        });
    }
};

module.exports = new DaoService();