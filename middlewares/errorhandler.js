var logger = require('log4js').getLogger('error_handler_middleware');

module.exports = {
    common: function(err, req, res, next) {

        logger.error('Common error: ', err);

        res.status(err.status || 500);
        res.send({
            errors: err.message
        });
    },

    error404: function(req, res, next) {
        logger.debug('Error 404 happened');

        res.status(404);
        res.send({
            errors: 'Lehekülge ei leitud'
        });
    }
};