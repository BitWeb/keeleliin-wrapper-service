var express = require('express');
var router = express.Router();
var config = require(__base + 'config');

router.use('/api/v1/service', require(__base + 'controllers/api/v1/service'));

/* GET home page. Service description from config */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: config.service.title,
    description: config.service.description
  });
});

module.exports = router;
