var logger = require('log4js').getLogger('statistics_controller');
var express = require('express');
var router = express.Router();
var statisticsService = require(__base + '/src/service/statisticsService');

router.get('/', function(req, res) {

    statisticsService.getServerStatistics( req, function (err, data) {
        if(err){
            res.code(520);
            return res.send(err);
        }
        return res.send(data);
    });
});

module.exports = router;
