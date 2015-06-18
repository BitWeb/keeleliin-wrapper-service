var logger = require('log4js').getLogger('service_controller');
var express = require('express');
var router = express.Router();
var ServiceRequest = require(__base + '/src/model/serviceRequest');
var WrapperService = require(__base + '/src/service/wrapperService');

router.post('/', function ( req, res ) {

    var serviceRequest = new ServiceRequest( req.body );

    if(!serviceRequest.isValid()){
        res.send(serviceRequest.getMessages());
        return;
    }

    var wrapperService = new WrapperService();
    wrapperService.execute( serviceRequest.getData() , function (err, data) {
        if(err) return res.send({errors: err});
        res.send(data);
    });
});

router.get('/:instanceId', function(req, res) {

    var wrapperService = new WrapperService();
    wrapperService.getServiceResponse(req.params.instanceId, function (err, data) {

        if(err){
            return res.status(404).send({errors: err});
        }
        res.send(data);
    });
});

module.exports = router;
