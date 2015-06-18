var logger = require('log4js').getLogger('router_middleware');
var express = require('express');

module.exports = {
    common: function(err, req, res, next) {
        logger.error(err.stack);

        res.status(err.status || 500);
        res.send({
            errors: err.message
        });
    },

    error404: function(req, res, next) {
        logger.error('Error 404 happened');
        res.status(404);
        res.send({
            errors: 'Lehekülge ei leitud'
        });
    }
};