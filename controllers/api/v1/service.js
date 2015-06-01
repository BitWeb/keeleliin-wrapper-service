var express = require('express');
var router = express.Router();
var ServiceRequest = require(__base + '/src/model/serviceRequest');
var ExecutorService = require(__base + '/src/service/executorService');

router.post('/', function (req, res, next) {

    var serviceRequest = new ServiceRequest( req.body );

    if(!serviceRequest.isValid()){
        res.send(serviceRequest.getMessages());
        return;
    }

    var executor = new ExecutorService();
    executor.execute( serviceRequest.getData() , function (data) {
        res.send(data);
    });
});

router.get('/:instanceId', function(req, res, next) {

    var executor = new ExecutorService();
    executor.getServiceResponse(req.params.instanceId, function (data) {
        res.send(data);
    });
});

module.exports = router;
