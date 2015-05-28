/**
 * Created by priit on 27.05.15.
 */

var debug = require('debug')('errorhandler');

var express = require('express');
var app = express();

module.exports = {
    common: function(err, req, res, next) {
        debug('Error happened');
        debug(err.stack);

        if (app.get('env') === 'development') {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        }

        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    },

    error404: function(req, res, next) {
        debug('Error 404 happened');
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
};