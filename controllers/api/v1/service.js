var express = require('express');
var router = express.Router();

var Executor = require(__base + '/src/service/executor').Executor;

router.post('/', function (req, res, next) {
    console.log('POST REQUEST');

    var executor = new Executor();
    executor.execute(req.body, function (data) {
        //console.log(data);
    });

    res.send(req.body);
});

/* GET services listing. */
router.get('/', function(req, res, next) {
    var executor = new Executor();
    executor.execute(req.body, function (data) {
        console.log(data);
    });
    res.send('respond with a resource');
});



/* GET item. */
router.get('/item/:id', function(req, res, next) {
    console.log(req.params.id);
    console.error('HELL');
    executor.execute('Tere taas', function(){
        console.log('CB');
    });
    res.send(req.params);
});

module.exports = router;
