var logger = require('log4js').getLogger('dao_service');
var redis = require('redis');
//redis.debug_mode = true;

var config = require(__base + 'config');

var DaoService = function(){
    var self = this;

    this.client = redis.createClient(config.redis.port, config.redis.host, {});

    this.client.on('connect', function() {
        logger.info('connected');
    });

    this.client.on("error", function (err) {
        logger.error("Redis Error " + err);
    });

    this.set =  function(key, value, cb){

        this.client.hmset(key, value, function (err, reply) {
            if(err){
                logger.error(err);
                return cb(err);
            }

            if(cb != undefined){
                return cb();
            }
        });
    };

    this.get = function(key, cb){

        this.client.hgetall(key, function(err, reply) {
            if(err){
                logger.error(err);
                return cb(err);
            }
            logger.debug('Got redis data');

            if(cb != undefined){
                return cb(null, reply);
            }
        });
    };

    this.delete = function(key, cb){

        this.client.del(key, function(err, reply) {
            if(err){
                logger.error(err);
            }

            if(cb != undefined){
                return cb();
            }
        });
    };

    this.exists = function(key, cb){

        this.client.exists(key, function(err, reply) {
            if(err){
                logger.error(err);
                return cb(err);
            }
            return cb(null, reply);
        });
    }
};

module.exports = new DaoService();