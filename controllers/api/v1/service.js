var express = require('express');
var router = express.Router();

var ExecutorService = require(__base + '/src/service/executorService');

router.post('/', function (req, res, next) {

    var executor = new ExecutorService();
    executor.execute(req.body, function (data) {
        res.send(data);
    });
});

router.get('/:instanceId', function(req, res, next) {

    var executor = new ExecutorService();

    console.log(req.params.instanceId);


    executor.getServiceResponse(req.params.instanceId, function (data) {
        res.send(data);
    });
});

module.exports = router;
