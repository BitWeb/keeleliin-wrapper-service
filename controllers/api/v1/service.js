var logger = require('log4js').getLogger('service_controller');
var express = require('express');
var router = express.Router();
var ServiceRequest = require(__base + '/src/model/serviceRequest');
var wrapperService = require(__base + '/src/service/wrapperService');
var fs = require('fs');
var installService = require(__base + '/src/service/integration/installService');

router.get('/config', function(req, res) {
    return res.send(installService.getConfiguration());
});


router.post('/', function ( req, res ) {

    var serviceRequest = new ServiceRequest( req.body, req.files );

    serviceRequest.isValid(function (err, isValid) {

        if(err || !isValid){
            logger.debug('Invalid request');
            res.send(serviceRequest.getMessages());
            return;
        }

        wrapperService.execute( serviceRequest, function (err, data) {
            if(err){
                logger.debug('Got error', err);
                return res.send({errors: err});
            }
            logger.debug('Send response');
            return res.send(data);
        });
    });
});

router.get('/:sessionId', function(req, res) {

    wrapperService.getServiceResponse(req.params.sessionId, function (err, data) {
        if(err){
            return res.status(404).send({errors: err});
        }
        res.send(data);
    });
});

router.get('/:sessionId/download/:fileId', function(req, res) {

    logger.debug({request:'Get file', instance: req.params.sessionId, file: req.params.fileId});

    wrapperService.getServiceFile(req.params.sessionId, req.params.fileId, function (err, outputFile) {
        if(err){
            return res.status(404).send({errors: err});
        }

        var filePath = outputFile.filePath;

        var stat = fs.statSync(filePath);
        res.writeHead(200,{
            'Content-Length': stat.size
        });

        var readStream = fs.createReadStream(filePath);
        readStream.on('open', function () {
            readStream.pipe(res);
        });
        readStream.on('error', function(err) {
            res.end(err);
        });
    });
});

router.get('/:sessionId/kill', function(req, res) {
    wrapperService.kill(req.params.sessionId, function (err, data) {
        if(err){
            return res.status(404).send({errors: err});
        }
        res.send(data);
    });
});



module.exports = router;
