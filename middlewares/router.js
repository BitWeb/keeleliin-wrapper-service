var logger = require('log4js').getLogger('router_middleware');
module.exports = {
    routeLogger: function(req, res, next){
        logger.debug('Something is happening in: ' + req.url);
        next();
     }
};