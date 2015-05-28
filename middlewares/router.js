/**
 * Created by priit on 27.05.15.
 */

//var config = require(__base + 'config');

module.exports = {
    routeLogger: function(req, res, next){
        console.log('Something is happening in: ' + req.url);
        next();
     }
};