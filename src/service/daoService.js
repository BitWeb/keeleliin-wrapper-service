var logger = require('log4js').getLogger('dao_service');
var redis = require('redis');
var config = require(__base + 'config');

var DaoService = function(){
    var self = this;

    var prefix = config.service.staticParams.uniqueId + ':';

    this.client = redis.createClient(config.redis.port, config.redis.host, {});

    this.client.on('connect', function() {
        logger.info('connected');
    });

    this.client.on("error", function (err) {
        logger.error("Redis Error " + err);
    });

    this.set =  function(key, value, cb){

        this.client.set(prefix + key, JSON.stringify(value), function (err, reply) {
            if(cb != undefined){
                cb(err, reply);
            }
        });
    };

    this.get = function(key, cb){

        this.client.get(prefix + key, function(err, reply) {
            if(cb != undefined){
                if(err){
                    return cb(err);
                }
                return cb(null, JSON.parse(reply));
            }
        });
    };

    this.delete = function(key, cb){

        this.client.del(prefix + key, function (err, reply) {
            if(cb != undefined){
                cb(err, reply);
            }
        } );
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